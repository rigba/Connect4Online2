import express from "express";
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { createServer } from 'http';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,} from "apollo-server-core";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createContext } from "./types";
import { readFileSync } from 'node:fs'
import { userResolver } from "./resolvers/userResolver";
import { buildSchema } from "graphql";


const conn = async () => {
    const app = express();
    const httpServer = createServer(app);

    const whitelist = ["http://localhost:5000", "https://studio.apollographql.com"]


    app.use(cors({
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin as string) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error(origin + ' not allowed by CORS'))
            }
        }
    }))

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
            path: '/',
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        },
        resave: false,
        saveUninitialized: true
    })


    app.use(sessionMiddleWare)

    const typeDefs = readFileSync('./schema.graphql', 'utf8')

    const schema = buildSchema(typeDefs)

    const server = new ApolloServer({
        typeDefs,
        resolvers: userResolver,
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
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
        context: createContext
    
    });

    const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, wsServer);


    await server.start()

    server.applyMiddleware({
        app,
        cors: false
    })


    httpServer.listen(5000, () => {
        console.log(`server started...`);
    });
}
conn();


