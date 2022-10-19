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
  ArgsType,
} from "type-graphql";
import { User } from "../entities/User";
import { Game } from "../entities/Game";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

@Resolver(Game)
export class gameResolver {
  @Query(() => Game, { nullable: true })
  async createGame(
    @Ctx() { req }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Game> {
    const game = new Game();

    const user = await User.findOne({ where: { id: req.session.userId } });
    if (!user) {
      throw new Error("Not Logged In");
    }

    game.users = [user];
    game.gameBoard = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    game.gameUUID = uuidv4();
    game.whoseMove = 0;

    try {
      await Game.save(game);
    } catch (err) {
      throw new Error("Game could not save");
    }
    pubSub.publish(String(game.id), game);
    return game;
  }

  @Mutation(() => Game, { nullable: true })
  async joinGame(
    @Ctx() { req }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Arg("gameId") gameId: number
  ): Promise<Game> {
    const game = await Game.findOne({ where: { id: gameId } });
    if (!game) {
      throw new Error("Game does not exist!");
    }

    const user = await User.findOne({ where: { id: req.session.userId } });
    if (!user) {
      throw new Error("Not Logged In");
    }

    if (game.users[0].id === user.id) {
      throw new Error("Cant join own game");
    }

    if (game.users.length === 2) {
      throw new Error("Game is full");
    }

    try {
      await Game.save(game);
    } catch (err) {
      throw new Error("Game could not save");
    }
    pubSub.publish(String(game.id), game);
    return game;
  }

  @Subscription(() => Game, { topics: (payload) => payload.args.gameId })
  async gameSubscription(
    @Root() payLoad: any,
    @Arg("gameId") _: string
  ): Promise<Game | null> {
    return payLoad;
  }



  @Mutation(() => Game, { nullable: true })
  async moveBoard(
    @Ctx() { req }: MyContext,
    @PubSub() pubSub: PubSubEngine,
    @Arg("pieceLocation", () => [Int]) pieceLocation: [number, number],
    @Arg("gameId") gameId: number
  ): Promise<Game> {
    const game = await Game.findOne({ where: { id: gameId } });
    if (!game) {
      throw new Error("Game does not exist!");
    }

    const user = await User.findOne({ where: { id: req.session.userId } });
    if (!user) {
      throw new Error("Not Logged In");
    }

    if (game.whoseMove !== user.id) {
      throw new Error("Not players move");
    }

    if (verifyMove(game.gameBoard, pieceLocation) !== true) {
      throw new Error("Illegal move");
    }

    game.gameBoard[pieceLocation[0]][pieceLocation[1]] =
      game.users[0].id === user.id ? 1 : 2;
    game.whoseMove =
      game.whoseMove === game.users[0].id ? game.users[1].id : game.users[0].id;

    if (isWinner(game.gameBoard, pieceLocation, game.users[0].id === user.id ? 1 : 2)) {
      game.winner = user.id
    }

    try {
      await Game.save(game);
    } catch (err) {
      throw new Error("Not Logged In");
    }
    pubSub.publish(String(game.id), game);
    return game;
  }
}

const isWinner = (
  gameBoard: number[][],
  proposedMove: [number, number],
  colorNumber: number
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

  let twoDimensionalVectors: any = twoDimensionalDirections.map((directions) => {
    return oneDimesionalVectors.map((oneDVectors) => {
      return [
        [directions[0] ? oneDVectors[0] : 0, directions[1] ? oneDVectors[0] : 0],
        [directions[0] ? oneDVectors[1] : 0, directions[1] ? oneDVectors[1] : 0],
        [directions[0] ? oneDVectors[2] : 0, directions[1] ? oneDVectors[2] : 0],
      ];
    });
  }); // [[[0, 1], [0, 2] [0, 3], [...], [...], [...]], [...], [...]]
  twoDimensionalVectors = twoDimensionalVectors.flat(1) // un-nests array [[0, 1], [...], [...], ...]

  for (let vectorGroup of twoDimensionalVectors as any as number[][][]) {
    let counter = 0
    console.log(vectorGroup)
    for (let vectors of vectorGroup) {
      if (proposedMove[0] + vectors[0] < 0 ||
        proposedMove[1] + vectors[1] < 0 ||
        proposedMove[0] + vectors[0] > gameBoard.length ||
        proposedMove[1] + vectors[1] > gameBoard[0].length
      ) {
        continue // out of bounds 
      }
      if (gameBoard[proposedMove[0] + vectors[0]][proposedMove[1] + vectors[1]] === colorNumber) {
        counter++
      }
    }
    if (counter === 3) {
      return true
    }
  }
  return false

};


const verifyMove = (
  gameBoard: number[][],
  proposedMove: [number, number]
): boolean => {
  if (gameBoard[proposedMove[0]][proposedMove[1]] !== 0) {
    throw new Error(`${[proposedMove[0]][proposedMove[1]]} is taken`);
  }
  if (gameBoard[proposedMove[0] + 1][proposedMove[1]] !== 0) {
    throw new Error(`${[proposedMove[0]][proposedMove[1]]} is a floating move`);
  }
  if (proposedMove[0] > 6 || proposedMove[1] > 7) {
    throw new Error(`${[proposedMove[0]][proposedMove[1]]} is out of bounds`);
  }

  return true;
};
