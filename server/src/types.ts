import session from "express-session";
import Redis, { Redis as RedisType } from "ioredis";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const pubSub = new RedisPubSub({
  publisher: new Redis(
    process.env.REDIS_URL
      ? process.env.REDIS_URL as string
      : "redis://localhost:6379"
  ),
  subscriber: new Redis(
    process.env.REDIS_URL
      ? process.env.REDIS_URL as string
      : "redis://localhost:6379"
  ),
});

export const prisma = new PrismaClient();

export type MyContext = {
  prisma: PrismaClient;
  redis: RedisType;
  req: Request & { session: session.SessionData }; // HTTP request carrying the `Authorization` header
  res: Response;
};

export function createContext(req: any, res: any) {
  return {
    ...req,
    ...res,
    prisma,
  };
}

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}
