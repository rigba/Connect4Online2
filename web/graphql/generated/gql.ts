/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "mutation ChangeUsername($username: String!) {\n  changeUsername(username: $username) {\n    id\n    username\n  }\n}": types.ChangeUsernameDocument,
    "mutation CreateGame {\n  createGame {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}": types.CreateGameDocument,
    "mutation createUser($username: String!) {\n  createUser(username: $username) {\n    id\n    username\n  }\n}": types.CreateUserDocument,
    "mutation deleteUser {\n  deleteUser\n}": types.DeleteUserDocument,
    "mutation JoinGame($gameId: String!) {\n  joinGame(gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}": types.JoinGameDocument,
    "mutation MovePiece($pieceLocation: [Int]!, $gameId: Int!) {\n  movePiece(pieceLocation: $pieceLocation, gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}": types.MovePieceDocument,
    "query FetchGame($gameId: String!) {\n  fetchGame(gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    createdId\n    joinedID\n  }\n}": types.FetchGameDocument,
    "query Me {\n  me {\n    id\n    username\n  }\n}": types.MeDocument,
    "subscription gameInfo($gameUUID: String!) {\n  gameInfo(gameUUID: $gameUUID) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    joined {\n      id\n    }\n    created {\n      id\n    }\n    gameUUID\n    createdId\n    joinedID\n  }\n}": types.GameInfoDocument,
};

export function graphql(source: "mutation ChangeUsername($username: String!) {\n  changeUsername(username: $username) {\n    id\n    username\n  }\n}"): (typeof documents)["mutation ChangeUsername($username: String!) {\n  changeUsername(username: $username) {\n    id\n    username\n  }\n}"];
export function graphql(source: "mutation CreateGame {\n  createGame {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}"): (typeof documents)["mutation CreateGame {\n  createGame {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}"];
export function graphql(source: "mutation createUser($username: String!) {\n  createUser(username: $username) {\n    id\n    username\n  }\n}"): (typeof documents)["mutation createUser($username: String!) {\n  createUser(username: $username) {\n    id\n    username\n  }\n}"];
export function graphql(source: "mutation deleteUser {\n  deleteUser\n}"): (typeof documents)["mutation deleteUser {\n  deleteUser\n}"];
export function graphql(source: "mutation JoinGame($gameId: String!) {\n  joinGame(gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}"): (typeof documents)["mutation JoinGame($gameId: String!) {\n  joinGame(gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}"];
export function graphql(source: "mutation MovePiece($pieceLocation: [Int]!, $gameId: Int!) {\n  movePiece(pieceLocation: $pieceLocation, gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}"): (typeof documents)["mutation MovePiece($pieceLocation: [Int]!, $gameId: Int!) {\n  movePiece(pieceLocation: $pieceLocation, gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    joined {\n      id\n      username\n    }\n    created {\n      id\n      username\n    }\n    createdId\n    joinedID\n  }\n}"];
export function graphql(source: "query FetchGame($gameId: String!) {\n  fetchGame(gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    createdId\n    joinedID\n  }\n}"): (typeof documents)["query FetchGame($gameId: String!) {\n  fetchGame(gameId: $gameId) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    gameUUID\n    createdId\n    joinedID\n  }\n}"];
export function graphql(source: "query Me {\n  me {\n    id\n    username\n  }\n}"): (typeof documents)["query Me {\n  me {\n    id\n    username\n  }\n}"];
export function graphql(source: "subscription gameInfo($gameUUID: String!) {\n  gameInfo(gameUUID: $gameUUID) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    joined {\n      id\n    }\n    created {\n      id\n    }\n    gameUUID\n    createdId\n    joinedID\n  }\n}"): (typeof documents)["subscription gameInfo($gameUUID: String!) {\n  gameInfo(gameUUID: $gameUUID) {\n    id\n    gameBoard\n    whoseMove\n    winner\n    joined {\n      id\n    }\n    created {\n      id\n    }\n    gameUUID\n    createdId\n    joinedID\n  }\n}"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;