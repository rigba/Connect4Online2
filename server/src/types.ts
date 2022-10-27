import session from "express-session";
import Redis, { Redis as RedisType } from "ioredis";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const pubSub = new RedisPubSub({
  publisher: new Redis(),
  subscriber: new Redis(),
});

const prisma = new PrismaClient();

export type MyContext = {
  prisma: PrismaClient;
  redis: RedisType;
  req: Request & { session: session.SessionData }; // HTTP request carrying the `Authorization` header
  res: Response;
  pubsub: RedisPubSub;
};

export function createContext(req: any, res: any) {
  return {
    ...req,
    ...res,
    pubSub,
    prisma,
  };
}
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}
