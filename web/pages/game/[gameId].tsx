import type { NextPage, NextPageContext } from "next";
import Taskbar from "../../components/Taskbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  MutationResult,
  QueryResult,
  SubscriptionResult,
  useLazyQuery,
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  CreateGameMutation,
  FetchGameDocument,
  GameInfoDocument,
  GameInfoSubscription,
  MeQuery,
} from "../../graphql/generated/graphql";
import GameStateUI from "../../components/GameStateUI";

const initBoard = [
  "0000000",
  "0000000",
  "0000000",
  "0000000",
  "0000000",
  "0000000",
]

const Game: NextPage = (xd) => {
  const [hovered, setHovered] = useState<[number, number]>([9, 9]);
  const [timer, setTimer] = useState({
    timePassed: 0,
    stroke: "283",
    active: false,
  });
  const router = useRouter();
  const { gameId } = router.query;
  const [userRes, setUserRes] = useState<QueryResult<MeQuery>>();
  const [gameQuery, gameInfo] = useLazyQuery(FetchGameDocument, {
    ssr: false,
    variables: { gameId },
  });
  useEffect(() => {
    if (!gameId) return;
    const subscribe = async () => {
      await gameQuery({ variables: { gameId: gameId as string } });
      gameInfo.subscribeToMore({
        document: GameInfoDocument,
        variables: { gameUUID: gameId as string },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return Object.assign({}, prev);
        },
      });
    };
    subscribe()
  }, [gameId]);

  const findDrop = (column): [number, number] => {
    for (let i = 0; i < initBoard.length; i++) {
      if (initBoard[i].charAt(column) !== "0") {
        return [i - 1, column];
      }
    }
    return [initBoard.length - 1, column];
  };

  return (
    <div className="mx-4 h-screen overflow-auto">
      <Taskbar passUser={setUserRes} />
      <div className="p-0 md:p-2" />
      <div
        className="flex flex-wrap flex-row justify-center gap-5 rounded-lg bg-gray-700 max-w-5xl mx-auto px-5 py-12 group shadow-2xl my-auto"
        onClick={() => console.log(gameInfo)}
      >
        <div className="initBoard w-full max-w-lg">
          {initBoard.map((val, i) => {
            const row = val.split("").map((val2, j) => {
              return (
                <div
                  className="inline-block relative z-0 tile-stroke"
                  key={`${i}-${j}-grid`}
                >
                  <svg
                    className={`
                  ${i == 0 && j == 0 ? "rounded-tl-2xl" : null}
                  ${i == 0 && j == 6 ? "rounded-tr-2xl" : null} 
                  ${i == 5 && j == 0 ? "rounded-bl-2xl" : null} 
                  ${i == 5 && j == 6 ? "rounded-br-2xl" : null} 
                  absolute w-full h-full`}
                    viewBox="0 0 500 500"
                    xmlns="http://www.w3.org/2000/svg"
                    onMouseEnter={() => setHovered(findDrop(j))}
                  >
                    <path
                      d="M-1.047-1.397H500.35V500H-1.047V-1.397Zm253.506 48.643c-112.112 0-202.993 90.881-202.993 202.993 0 112.106 90.881 202.987 202.993 202.987 112.111 0 202.992-90.881 202.992-202.987 0-112.112-90.881-202.993-202.992-202.993Z"
                      className="fill-blue-700"
                    />
                  </svg>

                  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                    <ellipse
                      className={
                        val2 === "0"
                          ? hovered[0] === i && hovered[1] === j
                            ? `hover-ani ${
                                gameInfo.data?.fetchGame?.createdId ==
                                userRes?.data?.me?.id
                                  ? "fill-red-500"
                                  : "fill-yellow-500"
                              }`
                            : "fill-blue-900"
                          : val2 === "1"
                          ? "fill-red-500"
                          : "fill-yellow-500"
                      }
                      cx="250.349"
                      cy="248.603"
                      rx="248.953"
                      ry="248.953"
                    />
                  </svg>
                </div>
              );
            });
            return row;
          })}
        </div>
        <div className="rounded-xl mx-4 shadow-lg bg-gray-600 p-4 px-9 my-auto" >
          <div className="text-center flex-col justify-center text-gray-50">
              Its Your Turn!
            </h1>
            <div className="relative z-0 w-1/2 h-3/4 mx-auto mb-3" onClick={() => startTimer()}>
              <svg className="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="fill-transparent ">
                  <circle className="stroke-slate-800 timer-outline" cx="50" cy="50" r="45" />
                </g>
                <path
                  id="base-timer-path-remaining"
                  style={{ strokeDasharray: `${timer.stroke} 283` }}
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
                <div className="my-auto public-lg">{15 - timer.timePassed}</div>

              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Game;

