import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express, { Request, Response } from "express";
import http from "http";
import { schema } from "./graphql/schema";
import { Context } from "./types/graphql";
import { prisma } from "@monorepo/db";

dotenv.config();

async function startServer() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("test");
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): Context => {
      return {
        req,
        res,
        prisma,
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8080 }, resolve)
  );
  console.log(`Listening at: http://localhost:${process.env.PORT || 8080}`);
}

startServer();
