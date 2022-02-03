import type { DocumentNode } from "graphql";
import path from "path";
import { readFileSync, existsSync, lstatSync, readdirSync } from "fs";
import { gql } from "apollo-server-express";

// Get graphql type definitions
function readGraphqlFiles(dir: string): DocumentNode[] {
  if (!existsSync(dir)) {
    throw new Error(`no dir: ${dir}`);
  }

  const definitions: DocumentNode[] = [];
  const files = readdirSync(dir);

  // Loop over all the files
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dir, files[i]);
    const stat = lstatSync(filePath);

    // Check if file path is a directory
    if (stat.isDirectory()) {
      readGraphqlFiles(filePath); // recursive
    } else if (filePath.indexOf(".graphql") >= 0) {
      definitions.push(gql(readFileSync(filePath, "utf8")));
    }
  }

  // Return an array of graphql document nodes
  return definitions;
}

export const typeDefs = readGraphqlFiles(__dirname);
