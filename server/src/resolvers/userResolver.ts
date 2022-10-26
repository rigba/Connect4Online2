import { MyContext } from 'src/types'
import { Resolvers, User } from '../../resolvers-types'

export const userResolver: Resolvers = {
    Query: {
        me: async (_, _args, context: MyContext): Promise<User> => {
            const user = await context.prisma.user.findFirst({ where: { id: context.req.session?.userId } })
            if (!user) {
                throw new Error("User does not exist")
            }
            return user
        }
    },
    Mutation: {
        createUser: async (_, args, context: MyContext): Promise<User> => {
            if (args.username.length < 3) {
                throw new Error("Username too short")
            }
            if (/[A-Za-z]/.test(args.username)) {
                throw new Error("Username must only include alphabetic letters")
            }
            const user = await context.prisma.user.create({ data: { username: args.username } })
            if (!user) {
                throw new Error("Error creating user")
            }
            return user
        },
        deleteUser: async (_, _args, context: MyContext): Promise<boolean> => {
            try {
                await context.prisma.user.delete({ where: { id: context.req.session?.userId } })
            } catch (err){
                throw new Error(err)
            }
            const deleteCookie = new Promise((resolve) =>
                context.req.session.destroy((err) => {
                    context.res.clearCookie("connect4");
                    if (err) {
                        console.log(err);
                        resolve(false);
                        return;
                    }

                    resolve(true);
                })
            );
            await deleteCookie

            return true
        },
        changeUsername: async (_, args, context: MyContext): Promise<User> => {
            const user = await context.prisma.user.findFirst({ where: { id: context.req.session?.userId } })
            if (!user) {
                throw new Error("User does not exist")
            }
            if (args.username.length < 3) {
                throw new Error("Username too short")
            }
            if (/[A-Za-z]/.test(args.username)) {
                throw new Error("Username must only include alphabetic letters")
            }
            user.username = args.username

            try {
                await context.prisma.user.update({ where: { id: user.id }, data: user })
            } catch (err){
                throw new Error(err)
            }
            
            return user
        }
    },
}

