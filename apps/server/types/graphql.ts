import { Request, Response } from "express";
import { PrismaClientType } from "@monorepo/db";

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClientType;
}
