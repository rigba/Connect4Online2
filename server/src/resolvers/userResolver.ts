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
require('dotenv').config();

@Resolver(User)
export class userResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: MyContext): Promise<User | null> {
        const user = await User.findOne({ where: { id: req.session?.userId } });
        if (!user) {
            return null;
        }
        return user;
    }

    @Mutation(() => User, { nullable: true })
    async createUser(@Arg("username") username: string, @Ctx() { req }: MyContext): Promise<User | null> {
        const user = new User();
        user.username = username;

        if (username.length < 4) {
            throw new Error("Your nickname must be greater than 3 characters long!");
        }

        try {
            const savedUser = await User.save(user);
            req.session.userId = savedUser.id;
        } catch (err) {
            if (err.code === "23505") {
                throw new Error("Username taken")
            }
        }

        return user;
    }


    @Mutation(() => User, { nullable: true })
    async chnageUsername(@Arg("username") username: string, @Ctx() { req }: MyContext): Promise<User | null> {
        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            return null;
        }
        if (username = user.username){
            return user
        }
        user.username = username;

        if (username.length < 4) {
            throw new Error("Your nickname must be greater than 3 characters long!");
        }

        try {
            const savedUser = await User.save(user);
            req.session.userId = savedUser.id;
        } catch (err) {
            return null;
        }

        return user;
    }

    @Mutation(() => User, { nullable: true })
    async deleteUser(@Ctx() { req }: MyContext): Promise<boolean> {

        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            return false;
        }
        await user.remove()

        return true;

    }
}

