import express from "express";
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createContext, MyContext, prisma } from "./types";
import { readFileSync } from "node:fs";
import { userResolver } from "./resolvers/userResolver"; 
import gameResolver from "./resolvers/gameResolver";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const app = express();
const httpServer = createServer(app);

const conn = async () => {
  const corsOptions: cors.CorsOptions = {
    origin: "http://localhost:3000",
    credentials: true
  }

  app.use(
    cors(corsOptions)  
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  const sessionMiddleWare = session({
    name: "connect4",
    secret: "mySecret",
    store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
      saveUninitialized: false,
      resave: false,
      
  });

  app.use(sessionMiddleWare);

  const typeDefs = readFileSync("./schema.graphql", "utf8");

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [userResolver, gameResolver],
  });

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ includeCookies: true, embed: true, }),
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: createContext,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: (ctx, args, msgs) => {
        return {
          ctx,
          args,
          msgs,
          prisma, 
        };
      },
      onConnect(ctx) {
        
        const promise:
          | Promise<Record<string, unknown> | boolean | void>
          | Record<string, unknown>
          | boolean
          | void = new Promise((resolve, _reject) => {
          const req = ctx.extra.request as MyContext["req"];

          sessionMiddleWare(req, {} as any, () => {
            const userId = req.session?.userId;
            return resolve({ userId });
          });
        });

        return promise;
      },
    },

    wsServer
  );
    await server.start();

  server.applyMiddleware({
    app,
    cors: corsOptions,
  });


  httpServer.listen(5000, () => {
    console.log(`server started...`);
  });
};
conn();
