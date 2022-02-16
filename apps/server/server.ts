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

import { redis, cache } from "./utils/redis";
import { isAuth } from "./utils/auth";
import connectRedis from "connect-redis";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      secret: string | null;
      validTotp: boolean;
      verified: boolean;
    };
  }
}

dotenv.config();

const RedisStore = connectRedis(session);

async function startServer() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://enne.dev"],
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
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 weeks
        sameSite: "lax",
        httpOnly: true,
        domain: process.env.NODE_ENV === "production" ? "enne.dev" : undefined,
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
          isAuth: isAuth(req.session.user),
          redis,
          cache,
        };
      }

      return {
        req,
        res,
        prisma,
        redis,
        user: null,
        isAuth: false,
        cache,
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
