import { Game, Resolvers } from "resolvers-types";
import { MyContext, pubSub } from "../types";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient, User } from "@prisma/client";

const gameResolver: Resolvers = {
  Mutation: {
    createGame: async (_, _args, context: MyContext): Promise<Game> => {
      console.log("Create Game: SessionID", context.req.session?.userId);
      if (!context.req.session.userId) throw new Error("Not logged in");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      if (!user) {
        console.log("Create Game: Error", "Auth Error");
        throw new Error("Auth error");
      }
      console.log("Create Game: User", user);
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
            rematch: [],
          },
        });
      } catch (err) {
        console.log("Create Game: Error", err);
        throw new Error(err);
      }
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
      return game;
    },

    joinGame: async (_, args, context: MyContext): Promise<Game> => {
      let game = await context.prisma.game
        .findUniqueOrThrow({
          where: { gameUUID: String(args.gameId) },
        })
        .catch();
      if (!game) {
        console.log("Join Game: Error", "Game does not exist");
        throw new Error("Game does not exist");
      }
      console.log("Join Game: Gmae", game);
      if (!context.req.session.userId) throw new Error("Not logged in");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      console.log("Join Game: User", user);
      if (!user) {
        console.log("Join Game: Error", "Error creating user");
        throw new Error("Error creating user");
      }
      if (game.createdId === user.id) {
        console.log("Join Game: Error", "Cant join own game");
        throw new Error("Cant join own game");
      }

      if (game.joinedID) {
        console.log("Join Game: Error", "Game is full");
        throw new Error("Game is full");
      }
      game.joinedID = context.req.session?.userId as number;

      try {
        game = await context.prisma.game.update({
          where: { id: game.id },
          data: game,
        });
      } catch (err) {
        console.log("Join Game: Error", "Game could not save");
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
        console.log("Move Piece: Error", "Game does not exist");
        throw new Error("Game does not exist!");
      }
      console.log("Move Piece: UserID", context.req.session?.userId);
      console.log("Move Piece: GameID", args.gameId);
      console.log("Move Piece: PieceLocation", args?.pieceLocation);
      if (!context.req.session.userId) throw new Error("Not logged in");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      if (!user) {
        console.log("Move Piece: Error", "User does not exist");
        throw new Error("User does not exist");
      }
      if (game.whoseMove !== user.id) {
        console.log("Move Piece: Error", "Not your move");
        throw new Error("Not your move");
      }

      if (game.winner) {
        pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
        return game;
      }

      if (!game.gameBoard[0].includes("0")) {
        //gameboard full
        game.gameBoard = [
          "0000000",
          "0000000",
          "0000000",
          "0000000",
          "0000000",
          "0000000",
        ];
        pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
        return context.prisma.game.update({
          where: { id: args.gameId },
          data: game,
        });
      }
      if (!args.pieceLocation) {
        args.pieceLocation = findRandomMove(game.gameBoard);
      }

      if (!verifyMove(game.gameBoard, args.pieceLocation as number[])) {
        console.log("Move Piece: Error", "Invalid Move");
        throw new Error("Invalid Move");
      }

      let row: string | string[] =
        game.gameBoard[args.pieceLocation[0] as number];
      row = (row as string).split("");
      row[args.pieceLocation[1] as number] =
        user.id === game.createdId ? "1" : "2";
      row = row.join("");

      game.gameBoard[args.pieceLocation[0] as number] = row;

      if (
        isWinner(
          game.gameBoard,
          args.pieceLocation as number[],
          user.id === game.createdId ? 1 : 2
        )
      ) {
        game.winner = user.id;
        pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
        return context.prisma.game.update({
          where: { id: args.gameId },
          data: game,
        });
      }

      game.whoseMove =
        game.createdId === context.req.session.userId
          ? (game.joinedID as number)
          : game.createdId;

      try {
        await context.prisma.game.update({
          where: { id: args.gameId },
          data: game,
        });
      } catch (err) {
        console.log("Move Piece: Error", err);
        throw new Error(err);
      }
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
      return game;
    },
    rematch: async (_, args, context: MyContext): Promise<Game> => {
      let game = await context.prisma.game
        .findUniqueOrThrow({
          where: { gameUUID: String(args.gameId) },
        })
        .catch();
      if (!game) {
        console.log("Rematch: Error", "Game does not exist");
        throw new Error("Game does not exist");
      }
      if (!context.req.session.userId) throw new Error("Not logged in");
      const user = await context.prisma.user.findUnique({
        where: { id: context.req.session?.userId },
      });
      if (!user) {
        console.log("Rematch: Error", "User does not exist");
        throw new Error("User is not logged in");
      }
      if (game.rematch) {
        if (!game.rematch.includes(user.id)) {
          game.rematch = [...game.rematch, user.id];
        } else {
          console.log("Rematch: Error", "Already rematched");
          throw new Error("Already rematched");
        }
      } else {
        game.rematch = [user.id];
      }
      if (game.rematch.length === 2) {
        game.gameBoard = [
          "0000000",
          "0000000",
          "0000000",
          "0000000",
          "0000000",
          "0000000",
        ];
        game.whoseMove =
          game.joinedID === game.winner
            ? game.createdId
            : (game.joinedID as number);
        game.winner = null;
        game.rematch = [];
      }

      try {
        game = await context.prisma.game.update({
          where: { id: game.id },
          data: game,
        });
      } catch (err) {
        console.log("Rematch: Error", err);
        throw new Error("Game could not save");
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
        console.log("Fetch Game: Error", "Game does not exist!");
        throw new Error("Game does not exist!");
      }
      pubSub.publish(`GAME_INFO_${game.gameUUID}`, { gameInfo: game });
      return game;
    },
  },
  Subscription: {
    gameInfo: {
      subscribe: (_, args) => ({
        [Symbol.asyncIterator]() {
          return pubSub.asyncIterator([`GAME_INFO_${args.gameUUID}`]);
        },
      }),
    },
  },
  Game: {
    async created(parent, _, context: MyContext): Promise<User | null> {
      return await context.prisma.user.findUnique({
        where: { id: parent.createdId },
      });
    },
    async joined(parent, _, context: MyContext): Promise<User | null> {
      if (!parent.joinedID) return null;
      return await context.prisma.user.findUnique({
        where: { id: parent.joinedID },
      });
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
      [1, 0], // vertical
      [0, 1], // hortizontal
      [1, 1], // diagonal left
      [-1, 1], // diagonal right
    ],
  ];

  let twoDimensionalVectors: any = twoDimensionalDirections.map(
    (directions) => {
      return oneDimesionalVectors.map((oneDVectors) => {
        return [
          [oneDVectors[0] * directions[0], oneDVectors[0] * directions[1]],
          [oneDVectors[1] * directions[0], oneDVectors[1] * directions[1]],
          [oneDVectors[2] * directions[0], oneDVectors[2] * directions[1]],
        ];
      });
    }
  ); // [[[0, 1], [0, 2] [0, 3], [...], [...], [...]], [...], [...]]
  twoDimensionalVectors = twoDimensionalVectors.flat(1); // un-nests array [[0, 1], [...], [...], ...]
  for (let vectorGroup of twoDimensionalVectors as any as number[][][]) {
    let counter = 0;
    for (let vectors of vectorGroup) {
      if (
        proposedMove[0] + vectors[0] < 0 || // -3, -3
        proposedMove[1] + vectors[1] < 0 ||
        proposedMove[0] + vectors[0] >= gameBoard.length ||
        proposedMove[1] + vectors[1] >= gameBoard[0].length
      ) {
        continue;
      }
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
  if (
    proposedMove[0] > 6 ||
    proposedMove[1] > 7 ||
    proposedMove[0] < 0 ||
    proposedMove[1] < 0
  ) {
    throw new Error(`${[proposedMove[0]][proposedMove[1]]} is out of bounds`);
  }
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

  return true;
};

const findRandomMove = (gameBoard: string[]) => {
  let potentialMoves: [number, number][] = [];

  for (let i = 0; i < gameBoard[0].length; i++) {
    for (let j = 0; j < gameBoard.length; j++) {
      if (j === gameBoard.length - 1 && gameBoard[j].charAt(i) === "0") {
        potentialMoves.push([j, i]);
        break;
      }
      if (gameBoard[j].charAt(i) !== "0" && j - 1 >= 0) {
        potentialMoves.push([j - 1, i]);
        break;
      }
    }
  }
  if (potentialMoves.length === 0) throw new Error("big problem");
  return potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
};

export default gameResolver;
