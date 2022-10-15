import { MyContext } from "../types";
import {
    Arg,
    Ctx,
    FieldResolver,
    Mutation,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    Root,
    Subscription,
    UseMiddleware,
    Int,
} from "type-graphql";
import { User } from "../entities/User"
import { Game } from "../entities/Game";
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

@Resolver(Game)
export class gameResolver {
    @Query(() => Game, { nullable: true })
    async createGame(@Ctx() { req, }: MyContext, @PubSub() pubSub: PubSubEngine): Promise<Game> {
        const game = new Game();

        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            throw new Error("Not Logged In");
        }

        game.users = [user]
        game.gameBoard = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        game.gameUUID = uuidv4()
        game.whoseMove = 0

        try {
            await Game.save(game);
        } catch (err) {
            throw new Error("Game could not save");
        }
        pubSub.publish(String(game.id), game)
        return game
    }

    @Mutation(() => Game, { nullable: true })
    async joinGame(@Ctx() { req, }: MyContext, @PubSub() pubSub: PubSubEngine, @Arg("gameId") gameId: number): Promise<Game> {
        const game = await Game.findOne({ where: { id: gameId } });
        if (!game) {
            throw new Error("Game does not exist!")
        }

        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            throw new Error("Not Logged In");
        }

        if (game.users[0].id === user.id) {
            throw new Error("Cant join own game")
        }

        if (game.users.length === 2) {
            throw new Error("Game is full")
        }

        try {
            await Game.save(game);
        } catch (err) {
            throw new Error("Game could not save");
        }
        pubSub.publish(String(game.id), game)
        return game
    }

    @Subscription(() => Game, { topics: (payload) => payload.args.gameId })
    async gameSubscription(@Root() payLoad: any, @Arg("gameId") _: string): Promise<Game | null> {
        return payLoad;
    }

        try {
            await Game.save(game);
        } catch (err) {
            throw new Error("Not Logged In");
        }
        return game
    }

}

