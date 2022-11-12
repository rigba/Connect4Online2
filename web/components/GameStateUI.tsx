import {
  LazyQueryHookOptions,
  LazyQueryResult,
  QueryResult,
  useMutation,
} from "@apollo/client";
import { useEffect, useState } from "react";
import {
  CreateUserDocument,
  FetchGameQuery,
  JoinGameDocument,
  MeQuery,
} from "../graphql/generated/graphql";
import { sleep } from "../utils/sleep";

const GameStateUI = ({
  game,
  user,
  timeLeft,
  gameId,
}: {
  game: LazyQueryResult<FetchGameQuery, {}>;
  user: QueryResult<MeQuery>;
  timeLeft: number;
  gameId: string;
}) => {
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState({
    username: { error: false, message: "" },
  });

  const [createUser, createuser] = useMutation(CreateUserDocument);
  const [joinGame, joinGameRes] = useMutation(JoinGameDocument);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.data?.me) {
      setFormError({ username: { error: false, message: "" } });
      if (username.length < 4) {
        return setFormError({
          username: { error: true, message: "Username is too short" },
        });
      }
      if (!/[a-zA-Z]+/.test(username)) {
        return setFormError({
          username: {
            error: true,
            message: "Username must only contain letters and digits",
          },
        });
      }
      await createUser({ variables: { username } }).catch(() => {
        return setFormError({
          username: { error: true, message: "Username is taken" },
        });
      });
      user.refetch();
    }
    try {
      await joinGame({ variables: { gameId } });
    } catch {}
  };
  if (user?.loading || joinGameRes.loading || !gameId) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-800 animate-spin fill-gray-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  if (
    game?.data?.fetchGame?.createdId === user?.data?.me?.id &&
    !game?.data?.fetchGame?.joinedID &&
    game?.data?.fetchGame &&
    user?.data?.me
  ) {
    return (
      <div className="flex text-center flex-col w-full max-w-xs items-center">
        <div className="font-public-lg w-fit text-md">
          Send this invite link to a friend!
        </div>
        <div className="p-2" />
        <h1
          className="bg-slate-800 rounded-md p-2 font-public-rg hover:underline text-sm mx-2"
          onClick={() =>
            navigator.clipboard.writeText(
              `www.connect4online.xyz/game/${gameId}`
            )
          }
        >
          {`www.connect4online.xyz/game/${gameId}`}{" "}
        </h1>
      </div>
    );
  }

  if (game?.data?.fetchGame?.id && user.data?.me?.id && game?.data?.fetchGame?.joinedID) {
    if (game?.data.fetchGame?.whoseMove === user.data.me.id) {
      //my move
      return (
        <div className="text-center flex-col justify-center text-gray-50">
          <h1>Its Your Turn!</h1>
          <div className="relative z-0 w-1/2 h-3/4 mx-auto mb-3">
            <svg
              className=""
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="fill-transparent ">
                <circle
                  className="stroke-slate-800 timer-outline"
                  cx="50"
                  cy="50"
                  r="45"
                />
              </g>
              <path
                id="base-timer-path-remaining"
                style={{
                  strokeDasharray: `${((timeLeft / 16) * 283).toFixed(0)} 283`,
                }}
                className="stroke-green-500 timer-outline fill-transparent transform rotate-90 timer-ticker"
                d="
      M 50, 50
      m -45, 0
      a 45,45 0 1,0 90,0
      a 45,45 0 1,0 -90,0
    "
              ></path>
            </svg>
            <span className="absolute top-0 flex justify-center w-full h-full">
              <div className="my-auto public-lg">{timeLeft}</div>
            </span>
          </div>
        </div>
      );
    } else {
      // your move
      return (
        <h1 className="font-public-lg text-xl my-1">opponents turn</h1>
      );
    }
  } else {
    return (
      <>
        <button
          onClick={() => console.log("dd", game?.data?.fetchGame, user.data?.me, game?.variables)}
        >
          debug button
        </button>
        <form
          className="grid w-full text-center flex-col justify-center h-fit"
          onSubmit={handleSubmit}
        >
          <h1 className="font-public-lg text-xl my-1">
            You have been invited to play!
          </h1>

          {!user?.data?.me && (
            <div className="mx-10">
              <label className="block text-xs font-medium text-gray-900 dark:text-gray-300 text-left mt-2">
                Username
              </label>
              <input
                type="text"
                id="first_name"
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${
                  formError.username.error &&
                  "ring-2 ring-red-500 focus:ring-red-300"
                } text-xs rounded-lg block w-full p-2  bg-gray-800 border-gray-600 placeholder-gray-400 text-white outline-none focus:ring-2 focus:ring-slate-300 my-2`}
                placeholder="username"
                required
              />
            </div>
          )}
          <h1 className="text-red-500">{formError.username.message}</h1>

          <button
            type="submit"
            className="text-white bg-rose-400 focus:outline-none font-medium rounded-lg text-sm w-32 px-5 py-2.5 my-1 text-center mx-auto mx-4"
          >
            Join Game
          </button>
        </form>
      </>
    );
  }
};

export default GameStateUI;
