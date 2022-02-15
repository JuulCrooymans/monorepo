import { Request, Response } from "express";
import { PrismaClientType } from "@monorepo/db";
import { Redis } from "ioredis";
import { CacheContext } from "../utils/redis";

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClientType;
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    secret: string | null;
    validTotp: boolean;
  } | null;
  isAuth: boolean;
  redis: Redis;
  cache: CacheContext;
}
