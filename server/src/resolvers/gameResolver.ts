import { Game, Resolvers } from "resolvers-types";
import { MyContext, pubSub } from "../types";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const gameResolver: Resolvers = {
  Mutation: {
    createGame: async (_, _args, context: MyContext): Promise<Game> => {
      if (!context.req.session.userId) throw new Error("Not logged in");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      if (!user) {
        throw new Error("Auth error");
      }
      let game;
      try {
        game = await context.prisma.game.create({
          data: {
            gameBoard: [
              "0000000",
              "0000000",
              "0000000",
              "0000000",
              "0000000",
              "0000000",
            ],
            gameUUID: uuidv4(),
            whoseMove: user.id,
            createdId: user.id,
          },
        });
      } catch (err) {
        throw new Error(err);
      }
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });

      return game;
    },

    joinGame: async (_, args, context: MyContext): Promise<Game> => {
      const game = await context.prisma.game
        .findUniqueOrThrow({
          where: { gameUUID: String(args.gameId) },
        })
        .catch();
      if (!game) {
        throw new Error("Game does not exist");
      }

      if (!context.req.session.userId) throw new Error("Not logged in");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      if (!user) {
        throw new Error("Error creating user");
      }

      if (game.createdId === user.id) {
        throw new Error("Cant join own game");
      }

      if (game.joinedID) {
        throw new Error("Game is full");
      }
      game.joinedID = (context.req.session?.userId) as number

      try {
        await context.prisma.game.update({
          where: { id: game.id },
          data: game,
        });
      } catch (err) {
        throw new Error("Game could not save");
      }
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
      return game;
    },
    movePiece: async (_, args, context: MyContext): Promise<Game> => {
      const game = await context.prisma.game.findUnique({
        where: { id: args.gameId },
      });
      if (!game) {
        throw new Error("Game does not exist!");
      }

      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      if (!user) {
        throw new Error("Error creating user");
      }

      if (!verifyMove(game.gameBoard, args.pieceLocation as number[])) {
        throw new Error("Invalid Move");
      }

      if (
        isWinner(
          game.gameBoard,
          args.pieceLocation as number[],
          user.id === game.createdId ? 1 : 2
        )
      ) {
        game.winner = user.id;
      }

      let row: string | string[] =
        game.gameBoard[args.pieceLocation[0] as number];
      row = (row as string).split("");
      row[args.pieceLocation[1] as number] =
        user.id === game.createdId ? "1" : "2";
      row = row.join("");

      game.gameBoard[args.pieceLocation[0] as number] = row;

      game.whoseMove =
        game.createdId === context.req.session.userId
          ? (game.joinedID as number)
          : game.createdId;
      console.log(game.whoseMove)

      try {
        await context.prisma.game.update({
          where: { id: args.gameId },
          data: game,
        });
      } catch (err) {
        console.log(err)
        throw new Error(err);
      }
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
      return game;
    },
  },
  Query: {
    fetchGame: async (_, args, context: MyContext): Promise<Game> => {
      const game = await context.prisma.game.findUnique({
        where: { gameUUID: args.gameId },
      });
      if (!game) {
        throw new Error("Game does not exist!");
      }
      console.log(game);
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
      return game;
    },
  },
  Game: {
    async created(parent, _, context: MyContext) {
      return await context.prisma.user.findUnique({
        where: { id: parent.createdId },
      });
    },
    async joined(parent, _, context: MyContext) {
      if (!parent.joinedID) return null;
      return await context.prisma.user.findUnique({
        where: { id: parent.joinedID },
      });
    },
  },
  Subscription: {
    gameInfo: {
      subscribe: (_, args) => ({
        [Symbol.asyncIterator]() {
          return pubSub.asyncIterator([
            `GAME_INFO_${args.gameUUID ? args.gameUUID : null}`,
          ]);
        },
      }),
    },
  },
};

const isWinner = (
  gameBoard: string[],
  proposedMove: number[],
  colorNumber: number
) => {
  const [oneDimesionalVectors, twoDimensionalDirections] = [
    [
      [1, 2, 3], // X 1 1 1
      [-1, 1, 2], // 1 X 1 1
      [-2, -1, 1], // 1 1 X 1
      [-3, -2, -1], // 1 1 1 X
    ],
    [
      [true, false], // vertical
      [false, true], // hortizontal
      [true, true], // diagonal
    ],
  ];

  let twoDimensionalVectors: any = twoDimensionalDirections.map(
    (directions) => {
      return oneDimesionalVectors.map((oneDVectors) => {
        return [
          [
            directions[0] ? oneDVectors[0] : 0,
            directions[1] ? oneDVectors[0] : 0,
          ],
          [
            directions[0] ? oneDVectors[1] : 0,
            directions[1] ? oneDVectors[1] : 0,
          ],
          [
            directions[0] ? oneDVectors[2] : 0,
            directions[1] ? oneDVectors[2] : 0,
          ],
        ];
      });
    }
  ); // [[[0, 1], [0, 2] [0, 3], [...], [...], [...]], [...], [...]]
  twoDimensionalVectors = twoDimensionalVectors.flat(1); // un-nests array [[0, 1], [...], [...], ...]
  for (let vectorGroup of twoDimensionalVectors as any as number[][][]) {
    let counter = 0;
    for (let vectors of vectorGroup) {
      if (
        proposedMove[0] + vectors[0] < 0 ||
        proposedMove[1] + vectors[1] < 0 ||
        proposedMove[0] + vectors[0] >= gameBoard.length ||
        proposedMove[1] + vectors[1] >= gameBoard[0].length
      ) {
        continue; // out of bounds
      }
      console.log(proposedMove[0],  vectors[0],
        proposedMove[1],  vectors[1])
      if (
        gameBoard[proposedMove[0] + vectors[0]].charAt(
          proposedMove[1] + vectors[1]
        ) === colorNumber.toString()
      ) {
        counter++;
      }
    }
    if (counter === 3) {
      return true;
    }
  }
  return false;
};

const verifyMove = (gameBoard: string[], proposedMove: number[]): boolean => {
  if (gameBoard[proposedMove[0]].charAt(proposedMove[1]) !== "0") {
    throw new Error(`${[proposedMove[0]][proposedMove[1]]} is taken`);
  }
  if (gameBoard.length <= proposedMove[0]) {
    if (gameBoard[proposedMove[0] + 1].charAt(proposedMove[1]) !== "0") {
      throw new Error(
        `${[proposedMove[0]][proposedMove[1]]} is a floating move`
      );
    }
  }
  if (proposedMove[0] > 6 || proposedMove[1] > 7) {
    throw new Error(`${[proposedMove[0]][proposedMove[1]]} is out of bounds`);
  }

  return true;
};

export default gameResolver;
