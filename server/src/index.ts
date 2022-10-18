import express from "express";
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { DataSource } from "typeorm";
import { Game } from "./entities/Game";
import { User } from "./entities/User";
import { buildSchema } from "type-graphql";
import { gameResolver } from "./resolvers/gameResolver";
import { userResolver } from "./resolvers/userResolver";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { createServer } from 'http';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import connectRedis from "connect-redis";
import Redis from "ioredis";
/*
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "connect4",
    synchronize: true,
    logging: true,
    entities: [Game, User],
    subscribers: [],
    migrations: [],
})

const conn = async () => {
    const app = express();
    const httpServer = createServer(app);

    AppDataSource.initialize()

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

    const pubSub = new RedisPubSub({
        publisher: new Redis(),
        subscriber: new Redis(),
    });

    const schema = await buildSchema({
        resolvers: [gameResolver, userResolver],
        pubSub,
        validate: false,
    })

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
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
        context: ({ req, res }) => ({ req, res, redis }),
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

*/
const isWinner = (
    _gameBoard: number[][],
    _proposedMove: [number, number],
    _colorNumber: number
) => {
    const [oneDimesionalVectors, twoDimensionalDirections] = [
        [[1, 2, 3], // X 1 1 1
        [-1, 1, 2], // 1 X 1 1
        [-2, -1, 1], // 1 1 X 1
        [-3, -2, -1], // 1 1 1 X
        ], [
            [true, false], // vertical
            [false, true], // hortizontal
            [true, true], // diagonal
        ]]

    const twoDimensionalVectors = twoDimensionalDirections.map((directions) => {
        return oneDimesionalVectors.map((oneDVectors) => {
            return [
                [directions[0] ? oneDVectors[0] : 0, directions[1] ? oneDVectors[0] : 0],
                [directions[0] ? oneDVectors[1] : 0, directions[1] ? oneDVectors[1] : 0],
                [directions[0] ? oneDVectors[2] : 0, directions[1] ? oneDVectors[2] : 0],
            ];
        });
    }); // [[[0, 1], [0, 2] [0, 3], [...], [...], [...]], [...], [...]]
    twoDimensionalVectors.flat(1) // un-nests array [[0, 1], [...], [...], ...]

    for (let vectorGroup in twoDimensionalVectors) {
        for (vectorGroup in twoDimensionalDirections) { }
    }

};

isWinner(
    [[0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 1]],
    [2, 3],
    1)
