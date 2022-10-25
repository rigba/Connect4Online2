import session from "express-session";
import { Redis } from "ioredis";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
  
}

const prisma = new PrismaClient()

export const context: Context = {
  prisma: prisma,
}


declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export type MyContext = {
  req: Request & {session : session.SessionData}
  res: Response;
  redis: Redis;
  prisma: Context["prisma"],
}

