import type { NextPage } from "next";
import Taskbar from "../../components/Taskbar";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import { ClockIcon, PlusIcon } from "@heroicons/react/20/solid";

enum gameStates {
  CREATED,
  JOINED,
  USER1TURN,
  USER2TURN,
  COMPLETED,
}

const res = {
  gameboard: [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
  users: [{ id: 1, name: "bob" }, { id: 2, username: "carl" }],
  whosTurn: 1,
  winner: 0
}

const myCol = 1



const Game: NextPage = () => {
  const [gameBoard, setGameBoard] = useState([[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 2, 0], [0, 0, 1, 2, 0, 1, 0]],)
  const [isTurn, setIsTurn] = useState(0)
  const [hovered, setHovered] = useState<[number, number]>([9, 9]);
  const router = useRouter()
  const { gameId } = router.query
  const [gameState, setGameState] = useState<gameStates>(gameStates.CREATED)
  const [timer, setTimer] = useState({ timePassed: 0, stroke: "283" });

  const findDrop = (column): [number, number] => {
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i][column] !== 0) {
        return [i - 1, column]
      }
    }
    return [gameBoard.length - 1, column]
  }

  function startTimer() {

    let time = setInterval(() => {
      setTimer({ ...timer, timePassed: timer.timePassed += 1 });
      setTimer({ ...timer, stroke: ((15 - timer.timePassed) / 15 * 283).toFixed(0) });
      console.log(timer);
      if (timer.timePassed >= 15) {
        setTimer({ timePassed: 0, stroke: "283" });
        clearInterval(time)
        return;
      }
    }, 1000);
  }



  return (
    <div className="mx-4">
      <Taskbar />
      <div className="flex flex-wrap flex-row justify-center my-5 gap-5 rounded-lg bg-slate-800 max-w-4xl mx-auto p-5 group inner-shadow-lg" onClick={() => console.log(hovered)}>
        <div className="gameBoard w-full max-w-lg">
          {gameBoard.map((val, i) => {
            const row = val.map((val2, j) => {

              return (
                <div className="inline-block relative tile-stroke" key={`${i}-${j}-grid`}>
                  <svg className={`
                  ${i == 0 && j == 0 ? "rounded-tl-2xl" : null}
                  ${i == 0 && j == 6 ? "rounded-tr-2xl" : null} 
                  ${i == 5 && j == 0 ? "rounded-bl-2xl" : null} 
                  ${i == 5 && j == 6 ? "rounded-br-2xl" : null} 
                  absolute w-full h-full`} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHovered(findDrop(j))}>
                    <path d="M-1.047-1.397H500.35V500H-1.047V-1.397Zm253.506 48.643c-112.112 0-202.993 90.881-202.993 202.993 0 112.106 90.881 202.987 202.993 202.987 112.111 0 202.992-90.881 202.992-202.987 0-112.112-90.881-202.993-202.992-202.993Z" className="fill-blue-700" />
                  </svg>

                  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                    <ellipse className={`${val2 === 0 ? (hovered[0] === i && hovered[1] === j ? `hover-ani ${myCol == 1 ? "fill-red-500" : "fill-yellow-500"}` : "fill-blue-900") 
                    : val2 === 1 ? "fill-red-500" : "fill-yellow-500"}`} cx="250.349" cy="248.603" rx="248.953" ry="248.953" />
                  </svg>


                </div>
              )

            })
            return row
          })}
        </div>
        <div className="rounded-xl mx-4 shadow-lg bg-slate-700 p-4 px-9 my-auto" >
          <div className="text-center flex-col justify-center">
            <h1 className="public-lg text-xl mb-5 whitespace-nowrap">
              Its Your Turn!
            </h1>
            <div className="relative w-1/2 h-3/4 mx-auto">
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
                <div className="my-auto">{15 - timer.timePassed}</div>

              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Game;

