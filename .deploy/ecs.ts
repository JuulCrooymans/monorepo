import "dotenv/config";
import * as awsx from "@pulumi/awsx";
import { join } from "path";
import { project, app } from "./project";

const apps = app();
const vpc = new awsx.ec2.Vpc(`${project}-vpc`, {});
const cluster = new awsx.ecs.Cluster(`${project}-cluster`, { vpc });
const imageRepo = new awsx.ecr.Repository(`${project}-image-repo`);

const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer(
  `${project}-load-balancer`,
  { securityGroups: cluster.securityGroups, external: true, vpc }
);

for (const app of apps) {
  const listener = alb.createListener(`${app.name}-listener`, {
    vpc,
    loadBalancer: alb,
    external: false,
  });

  listener.addListenerRule(`${app.name}-rule`, {
    actions: [{ type: "forward" }],
    conditions: [
      {
        pathPattern: {
          values: [],
        },
      },
    ],
  });

  const service = new awsx.ecs.FargateService(`${app.name}-service`, {
    cluster,
    taskDefinitionArgs: {
      container: {
        image: imageRepo.buildAndPushImage(
          join(process.cwd(), app.imagePathFromRoot)
        ),
        portMappings: [{ containerPort: app.port }],
      },
    },
  });
}

// const alb = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer(
//   `${project}-load-balancer`,
//   { securityGroups: cluster.securityGroups, external: true, vpc }
// );

// const atg = alb.createTargetGroup(`${apps[0].name}-target-group`, {
//   port: 8080,
//   vpc
// });
// const listener = atg.createListener(`${apps[0].name}-listener`, {
//   port: 80,
//   external: true,
//   vpc
// });
// listener.addListenerRule(`${apps[0].name}-rule`, {
//   actions: [{ type: "forward", targetGroupArn: atg.targetGroup.arn }],
//   conditions: [
//     {
//       pathPattern: {
//         values: ["/*"],
//       },
//     },
//     {
//       hostHeader: {
//         values: ["sheetscms.com"],
//       },
//     },
//   ],
// });

// const appService = new awsx.ecs.FargateService(`${apps[0].name}-task`, {
//   cluster,
//   taskDefinitionArgs: {
//     containers: {
//       [apps[0].name]: {
//         image: imageRepo.buildAndPushImage(
//           join(process.cwd(), apps[0].imagePathFromRoot)
//         ),
//         portMappings: [listener],
//       },
//     },
//   },
//   desiredCount: 2,
// });

// export const endpoint = listener.endpoint.hostname;

// // Initialize the Application listener
// // const loadBalancer = new awsx.elasticloadbalancingv2.ApplicationListener(
// //   `${project}-load-balancer`,
// //   {
// //     vpc,
// //   }
// // );

// const gateWay = new awsx.apigateway.API(`${project}-apigateway`, {});

// // for (const app of apps) {
// const appTargetGroup = new awsx.lb.NetworkTargetGroup(
//   `${apps[0].name}-target-group`,
//   {
//     port: 8080,
//   }
// );

// const appListener = appTargetGroup.createListener(`${apps[0].name}-listener`, {
//   port: 80,
//   vpc,
// });

// // Create a service with a task
// const service = new awsx.ecs.FargateService(`${apps[0].name}-service`, {
//   cluster,
//   desiredCount: apps[0].replicas ?? 1,
//   taskDefinitionArgs: {
//     container: {
//       image: imageRepo.buildAndPushImage(
//         join(process.cwd(), apps[0].imagePathFromRoot)
//       ),
//       portMappings: [appListener],
//     },
//   },
// });
// // }

// export const url = appListener.endpoint.hostname;
