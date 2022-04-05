import "dotenv/config";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import { join } from "path";
import { project, app } from "./project";

const apps = app();

// Initialize a Virtual Private Cloud where the kubernetes cluster lives
const vpc = new awsx.ec2.Vpc(`${project}-vpc`, {});

// Initialize the image repository for the docker images
const imageRepo = new awsx.ecr.Repository(`${project}-image-repo`);

// Initialize the kubernetes cluster
const cluster = new eks.Cluster(`${project}-cluster`, {
  vpcId: vpc.id,
  privateSubnetIds: vpc.privateSubnetIds,
  publicSubnetIds: vpc.publicSubnetIds,
  nodeAssociatePublicIpAddress: false,
  fargate: true,
});

// Helm chart: nginx-ingress
const nginxIngress = new k8s.helm.v3.Chart(
  `${project}-nginx-ingress`,
  {
    chart: "nginx-ingress",
    fetchOpts: { repo: "https://charts.helm.sh/stable/" },
    values: { controller: { publishService: { enabled: true } } }, // Publish the IP address of the load balancer for external-dns helm chart
  },
  { provider: cluster.provider }
);

// Helm chart: external-dns
const externalDNS = new k8s.helm.v3.Chart(
  `${project}-external-dns`,
  {
    chart: "external-dns",
    fetchOpts: { repo: "https://charts.bitnami.com/bitnami" },
    values: {
      provider: "cloudflare", // The DNS records will be created on Cloudflare
      sources: ["ingress"], // K8s resources type to be observed for new DNS entries by ExternalDNS
      policy: "sync", // Keep the DNS records in sync
      cloudflare: {
        apiToken: process.env.CLOUDFLARE_API_KEY,
      },
    },
  },
  { provider: cluster.provider }
);

// Create a service and deployment for each app
for (const app of apps) {
  // Create an app service
  const service = new k8s.core.v1.Service(
    `${app.name}-service`,
    {
      metadata: { name: app.name },
      spec: {
        type: "ClusterIP",
        ports: [{ port: app.port, targetPort: app.containerPort }],
        selector: { app: app.name },
      },
    },
    { provider: cluster.provider }
  );

  // Create an app deployment
  const deployment = new k8s.apps.v1.Deployment(
    `${app.name}-deployment`,
    {
      metadata: { name: app.name },
      spec: {
        replicas: app.replicas,
        selector: { matchLabels: { app: app.name } },
        template: {
          metadata: {
            labels: { app: app.name },
          },
          spec: {
            containers: [
              {
                name: app.name,
                image: imageRepo.buildAndPushImage(
                  join(process.cwd(), app.imagePathFromRoot)
                ),
                ports: [{ containerPort: app.containerPort }],
              },
            ],
          },
        },
      },
    },
    { provider: cluster.provider }
  );
}

// Ingress
const ingress = new k8s.networking.v1.Ingress(
  `${project}-ingress`,
  {
    metadata: {
      name: `${project}-ingress`,
      annotations: { "kubernetes.io/ingress.class": "nginx" },
    },
    spec: {
      rules: apps.map((app) => ({
        host: app.host,
        http: {
          paths: [
            {
              path: app.path,
              pathType: "Prefix",
              backend: {
                service: {
                  name: app.name,
                  port: { number: app.port },
                },
              },
            },
          ],
        },
      })),
    },
  },
  { provider: cluster.provider }
);

export const kubeconfig = cluster.kubeconfig;
