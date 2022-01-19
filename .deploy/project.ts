import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

interface App {
  name: string;
  port: number;
  containerPort: number;
  imagePathFromRoot: string;
  host: string;
  path: string;
  replicas?: number;
}

// The project name
export const project = "monorepo";

// All apps that need to be deployed
export function app() {
  const directories = readdirSync(join(process.cwd(), "/apps"));
  const apps: App[] = [];

  for (const dir of directories) {
    const file = join(process.cwd(), "/apps", `/${dir}`, "deployment.json");
    const dockerfile = join(process.cwd(), "/apps", `/${dir}`, "Dockerfile");

    // check if the app directory has a deployment.json and a dockerfile
    if (existsSync(file) && existsSync(dockerfile)) {
      const raw = readFileSync(file);
      const json = JSON.parse(raw as unknown as string);
      // Add the app to the list
      apps.push({ ...json, imagePathFromRoot: `/apps/${dir}` });
    }
  }

  return apps;
}
