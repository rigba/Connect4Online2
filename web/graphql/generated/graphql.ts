/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Game = {
  __typename?: 'Game';
  created?: Maybe<User>;
  createdId: Scalars['Int'];
  gameBoard: Array<Maybe<Scalars['String']>>;
  gameUUID: Scalars['String'];
  id: Scalars['Int'];
  joined?: Maybe<User>;
  joinedID?: Maybe<Scalars['Int']>;
  rematch?: Maybe<Array<Maybe<Scalars['Int']>>>;
  whoseMove: Scalars['Int'];
  winner?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeUsername?: Maybe<User>;
  createGame?: Maybe<Game>;
  createUser?: Maybe<User>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  joinGame?: Maybe<Game>;
  movePiece?: Maybe<Game>;
  rematch?: Maybe<Game>;
};


export type MutationChangeUsernameArgs = {
  username: Scalars['String'];
};


export type MutationCreateUserArgs = {
  username: Scalars['String'];
};


export type MutationJoinGameArgs = {
  gameId: Scalars['String'];
};


export type MutationMovePieceArgs = {
  gameId: Scalars['Int'];
  pieceLocation?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type MutationRematchArgs = {
  gameId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  fetchGame?: Maybe<Game>;
  me?: Maybe<User>;
};


export type QueryFetchGameArgs = {
  gameId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  gameInfo?: Maybe<Game>;
};


export type SubscriptionGameInfoArgs = {
  gameUUID: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  game?: Maybe<Array<Maybe<Game>>>;
  id: Scalars['Int'];
  username: Scalars['String'];
};

export type ChangeUsernameMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername?: { __typename?: 'User', id: number, username: string } | null };

export type CreateGameMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame?: { __typename?: 'Game', id: number, gameBoard: Array<string | null>, whoseMove: number, winner?: number | null, gameUUID: string, createdId: number, joinedID?: number | null, joined?: { __typename?: 'User', id: number, username: string } | null, created?: { __typename?: 'User', id: number, username: string } | null } | null };

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: number, username: string } | null };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null };

export type JoinGameMutationVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type JoinGameMutation = { __typename?: 'Mutation', joinGame?: { __typename?: 'Game', id: number, gameBoard: Array<string | null>, whoseMove: number, winner?: number | null, gameUUID: string, createdId: number, joinedID?: number | null, joined?: { __typename?: 'User', id: number, username: string } | null, created?: { __typename?: 'User', id: number, username: string } | null } | null };

export type MovePieceMutationVariables = Exact<{
  pieceLocation?: InputMaybe<Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>>;
  gameId: Scalars['Int'];
}>;


export type MovePieceMutation = { __typename?: 'Mutation', movePiece?: { __typename?: 'Game', id: number, gameBoard: Array<string | null>, whoseMove: number, winner?: number | null, gameUUID: string, createdId: number, joinedID?: number | null, joined?: { __typename?: 'User', id: number, username: string } | null, created?: { __typename?: 'User', id: number, username: string } | null } | null };

export type RematchMutationVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type RematchMutation = { __typename?: 'Mutation', rematch?: { __typename?: 'Game', id: number, gameBoard: Array<string | null>, whoseMove: number, winner?: number | null, gameUUID: string, createdId: number, joinedID?: number | null, rematch?: Array<number | null> | null, joined?: { __typename?: 'User', id: number, username: string } | null, created?: { __typename?: 'User', id: number, username: string } | null } | null };

export type FetchGameQueryVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type FetchGameQuery = { __typename?: 'Query', fetchGame?: { __typename?: 'Game', id: number, gameBoard: Array<string | null>, whoseMove: number, winner?: number | null, gameUUID: string, createdId: number, joinedID?: number | null, rematch?: Array<number | null> | null, joined?: { __typename?: 'User', id: number, username: string } | null, created?: { __typename?: 'User', id: number, username: string } | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null };

export type GameInfoSubscriptionVariables = Exact<{
  gameUUID: Scalars['String'];
}>;


export type GameInfoSubscription = { __typename?: 'Subscription', gameInfo?: { __typename?: 'Game', id: number, gameBoard: Array<string | null>, whoseMove: number, winner?: number | null, gameUUID: string, createdId: number, joinedID?: number | null, rematch?: Array<number | null> | null, joined?: { __typename?: 'User', id: number } | null, created?: { __typename?: 'User', id: number } | null } | null };


export const ChangeUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<ChangeUsernameMutation, ChangeUsernameMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gameBoard"}},{"kind":"Field","name":{"kind":"Name","value":"whoseMove"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"gameUUID"}},{"kind":"Field","name":{"kind":"Name","value":"joined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedID"}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const JoinGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gameBoard"}},{"kind":"Field","name":{"kind":"Name","value":"whoseMove"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"gameUUID"}},{"kind":"Field","name":{"kind":"Name","value":"joined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedID"}}]}}]}}]} as unknown as DocumentNode<JoinGameMutation, JoinGameMutationVariables>;
export const MovePieceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MovePiece"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pieceLocation"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movePiece"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pieceLocation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pieceLocation"}}},{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gameBoard"}},{"kind":"Field","name":{"kind":"Name","value":"whoseMove"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"gameUUID"}},{"kind":"Field","name":{"kind":"Name","value":"joined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedID"}}]}}]}}]} as unknown as DocumentNode<MovePieceMutation, MovePieceMutationVariables>;
export const RematchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Rematch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rematch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gameBoard"}},{"kind":"Field","name":{"kind":"Name","value":"whoseMove"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"gameUUID"}},{"kind":"Field","name":{"kind":"Name","value":"joined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedID"}},{"kind":"Field","name":{"kind":"Name","value":"rematch"}}]}}]}}]} as unknown as DocumentNode<RematchMutation, RematchMutationVariables>;
export const FetchGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gameBoard"}},{"kind":"Field","name":{"kind":"Name","value":"whoseMove"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"gameUUID"}},{"kind":"Field","name":{"kind":"Name","value":"createdId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedID"}},{"kind":"Field","name":{"kind":"Name","value":"joined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rematch"}}]}}]}}]} as unknown as DocumentNode<FetchGameQuery, FetchGameQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GameInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"gameInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameUUID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameUUID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameUUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gameBoard"}},{"kind":"Field","name":{"kind":"Name","value":"whoseMove"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"joined"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gameUUID"}},{"kind":"Field","name":{"kind":"Name","value":"createdId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedID"}},{"kind":"Field","name":{"kind":"Name","value":"rematch"}}]}}]}}]} as unknown as DocumentNode<GameInfoSubscription, GameInfoSubscriptionVariables>;