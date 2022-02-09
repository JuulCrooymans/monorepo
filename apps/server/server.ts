import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express, { Request, Response } from "express";
import http from "http";
import { schema } from "./graphql/schema";
import { Context } from "./types/graphql";
import { prisma } from "@monorepo/db";
import cors from "cors";
import session from "express-session";

import Redis from "ioredis";
import connectRedis from "connect-redis";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
    };
  }
}

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
const RedisStore = connectRedis(session);

async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

  app.use(
    session({
      store: new RedisStore({ client: redis }),
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      name: "sess",
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 weeks
        sameSite: "lax" as "lax", // string is not compatible with cookie.sameSite
        httpOnly: true,
      },
    })
  );

  app.get("/", (req, res) => {
    res.send("test");
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): Context => {
      if (req.session && req.session.user) {
        return {
          req,
          res,
          prisma,
          user: req.session.user,
        };
      }

      return {
        req,
        res,
        prisma,
        user: null,
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app, cors: false });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8080 }, resolve)
  );
  console.log(`Listening at: http://localhost:${process.env.PORT || 8080}`);
}

startServer();
