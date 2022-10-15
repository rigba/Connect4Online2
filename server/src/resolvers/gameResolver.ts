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
    async createGame(@Ctx() { req }: MyContext): Promise<Game> {
        const game = new Game();

        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            throw new Error("Not Logged In");
        }

        game.users = [user]
        game.gameBoard = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        game.gameUUID = uuidv4()

        try {
            await Game.save(game);
        } catch (err) {
            throw new Error("Not Logged In");
        }
        return game
    }

}

