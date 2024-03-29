import { runHttpQuery } from "apollo-server-core";
import { MyContext, pubSub } from "src/types";
import { Resolvers, User } from "../../resolvers-types";

export const userResolver: Resolvers = {
  Query: {
    me: async (_, _args, context: MyContext): Promise<User> => {
      console.log("Me Query: UserID", context.req?.session?.userId);
      if (!context.req?.session?.userId) throw new Error("Not logged in!");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req?.session?.userId },
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      return user;
    },
  },
  Mutation: {
    createUser: async (_, args, { req, prisma }: MyContext): Promise<User> => {
      console.log("Create User: UserID", req?.session?.userId);
      if (args.username.length < 3) {
        throw new Error("Username too short");
      }
      if (!/[A-z]/.test(args.username)) {
        throw new Error("Username must only include alphabetic letters");
      }
      const user = await prisma.user.create({
        data: { username: args.username },
      });
      if (!user) {
        console.log("Create User: Error", "Error creating user");
        throw new Error("Error creating user");
      }
      req.session.userId = user.id;
      return user;
    },
    deleteUser: async (
      _,
      _args,
      { req, res, prisma }: MyContext
    ): Promise<boolean> => {
      try {
        await prisma.user.delete({
          where: { id: req.session?.userId },
        });
      } catch (err) {
        throw new Error(err);
      }
      const deleteCookie = new Promise((resolve) =>
        req.session.destroy((err) => {
          res.clearCookie("connect4");
          if (err) {
            resolve(false);
            return;
          }

          resolve(true);
        })
      );
      await deleteCookie;

      return true;
    },
    changeUsername: async (
      _,
      args,
      { req, prisma }: MyContext
    ): Promise<User> => {
      const user = await prisma.user.findUnique({
        where: { id: req.session?.userId },
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      if (args.username.length < 3) {
        throw new Error("Username too short");
      }
      if (!/[A-z]/.test(args.username)) {
        throw new Error("Username must only include alphabetic letters");
      }
      user.username = args.username;

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: user,
        });
      } catch (err) {
        throw new Error(err);
      }

      return user;
    },
  },
};
