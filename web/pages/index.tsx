import type { NextPage } from "next";
import Taskbar from "../components/Taskbar";
import { QueryResult, useMutation, useQuery, useSubscription } from "@apollo/client";
import { CreateGameDocument, CreateUserDocument, MeQuery } from "../graphql/generated/graphql";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const router = useRouter()
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState({
    username: { error: false, message: "" },
  });
  const [userRes, setUserRes] = useState<QueryResult<MeQuery>>(undefined)
  const [createUser, createUserRes] = useMutation(CreateUserDocument);
  const [createGame, createGameRes] = useMutation(CreateGameDocument);
  const [timer, setTimer] = useState({
    timePassed: 0,
    stroke: "283",
    active: false,
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userRes.data?.me) {
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
      const user = await createUser({ variables: { username } }).catch(() => {
        return setFormError({
          username: { error: true, message: "Username is taken" },
        });
      });
    }
    try {
      let game = await createGame()
      if(!game.data) return
      router.replace(`/game/${game.data.createGame.gameUUID}`)

    } catch{}
  };
  
  return (
    <div className="mx-4">
      <Taskbar passUser={setUserRes}/>
      <div className="flex justify-center my-10 gap-5 rounded-md bg-slate-800 max-w-4xl mx-auto py-10 group inner-shadow-lg ">
        <div className="hidden md:block w-1/2 mx-10">
          <BoardVector className="" />
        </div>
        <form
          className="rounded-xl mx-4 max-w-xl shadow-lg bg-slate-700 p-4 px-9 h-fit my-auto"
          onSubmit={handleSubmit}
        >
          <div className="grid w-full text-center flex-col justify-center h-fit" onClick={() => null}>
            <text className="font-public-lg text-xl mb-5">
              Play Connect 4 Online With Friends!
            </text>
            {!userRes?.data?.me && <div className="mx-10">
              <label className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300 text-left">
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
                } text-xs rounded-lg block w-full p-2 bg-gray-800 border-gray-600 placeholder-gray-400 text-white outline-none focus:ring-2 focus:ring-slate-300`}
                placeholder="username"
                required
              />
            </div>}
            <text className="text-red-500">{formError.username.message}</text>
            <button
              type="submit"
              onClick={() => console.log("button clicked")}
              className="text-white bg-rose-400 focus:outline-none font-medium rounded-lg text-sm w-32 px-5 py-2.5 text-center mx-auto mt-4 mb-10"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const BoardVector = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 337.99 502.2"
      className=""
    >
      <path
        d="M22.39 168.36v333.72l315.6-152.47V15.89L22.39 168.36z"
        className="fill-blue-900"
      />
      <path
        d="M22.39 168.36v333.72L0 485.02V144.9L310.27 5.23l27.72 10.66-315.6 152.47z"
        className="fill-blue-900"
      />
      <g id="Layer_4" data-name="Layer 4">
        <path
          d="M250.87 437.84c2.13 0 41.58-19.52 41.58-19.52l3.2-166-48 19.53Z"
          className="fill-red-500"
          transform="translate(-92 -4)"
        />
        <path
          d="m206.85 356.01 40.51-15.99 3.2 44.78-7.46 9.59-33.06 13.86-6.39-15.99 3.2-36.25zM115.15 345.35l-3.2 108.75 40.52-15.99 5.33-15.99-2.13-90.63-40.52 13.86z"
          className="fill-yellow-500"
        />
      </g>
      <g
        id="Layer_2"
        data-name="Layer 2"
        className="group-hover:animate-bounce2"
      >
        <ellipse
          cx="269.05"
          cy="31.99"
          className="fill-red-600"
          rx="29.26"
          ry="19.8"
          transform="rotate(-66.65 219.997 99.959)"
        />
        <ellipse
          cx="273.12"
          cy="32.65"
          className="fill-red-500"
          rx="29.26"
          ry="19.8"
          transform="rotate(-66.65 224.076 100.614)"
        />
      </g>
      <path
      className="fill-blue-700"

        d="m384.84 41.57-45.14 21.8-45.14 21.8L249.42 107l-45.14 21.8-45.14 21.8L114 172.37V506.2l45.14-21.8 45.14-21.8 45.14-21.8 45.15-21.8 45.14-21.8 45.14-21.8L430 353.6V19.77ZM136.71 492.22c-11.18 5.4-20.25-1.4-20.25-15.19s9.07-29.35 20.25-34.75S157 443.67 157 457.46s-9.1 29.35-20.29 34.76Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75S157 388 157 401.82s-9.1 29.36-20.29 34.76Zm0-55.64c-11.19 5.4-20.26-1.39-20.26-15.19s9.07-29.35 20.26-34.75S157 332.4 157 346.19s-9.1 29.35-20.29 34.75Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.29 1.4 20.29 15.19-9.1 29.35-20.29 34.75Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75S157 221.12 157 234.91s-9.1 29.35-20.29 34.76Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75S157 165.48 157 179.27s-9.1 29.35-20.29 34.73Zm45.15 256.39c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.25-34.75 20.26 1.39 20.26 15.18S193 465 181.86 470.42Zm0-55.64c-11.18 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.12 29.36-20.27 34.76Zm0-55.64c-11.19 5.4-20.26-1.39-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.4 20.26 15.19-9.12 29.35-20.27 34.75Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.12 29.35-20.27 34.75Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.12 29.35-20.27 34.76Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.12 29.35-20.27 34.76ZM227 448.62c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.07 29.35-20.25 34.76Zm0-55.62c-11.18 5.4-20.26-1.4-20.26-15.19S215.8 348.44 227 343s20.26 1.39 20.26 15.18-9.08 29.4-20.26 34.82Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19S215.8 292.8 227 287.4s20.26 1.4 20.26 15.19-9.08 29.35-20.26 34.75Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.08 29.33-20.26 34.73Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.08 29.33-20.26 34.73Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18S238.18 165 227 170.43Zm45.15 256.39c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.08 29.33-20.26 34.74Zm0-55.64c-11.18 5.4-20.25-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.09 29.34-20.28 34.74Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.4 20.26 15.19-9.09 29.33-20.28 34.73Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.09 29.33-20.28 34.73Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.09 29.33-20.28 34.73Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.09 29.33-20.28 34.74ZM317.28 405c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.07 29.37-20.25 34.76Zm0-55.64C306.09 354.78 297 348 297 334.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.06 29.38-20.25 34.76Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.4 20.26 15.19-9.08 29.37-20.27 34.77Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.08 29.37-20.27 34.77Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.08 29.37-20.27 34.77Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.08 29.37-20.27 34.78Zm45.15 256.39c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.08 29.37-20.26 34.78Zm0-55.64c-11.18 5.4-20.25-1.4-20.25-15.19s9.06-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.09 29.37-20.28 34.78Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.4 20.26 15.19-9.09 29.37-20.28 34.77Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.09 29.37-20.28 34.77Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.09 29.37-20.28 34.77Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.09 29.37-20.28 34.75Zm45.15 256.39c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.09 29.36-20.27 34.78Zm0-55.64c-11.18 5.4-20.25-1.4-20.25-15.19s9.06-29.35 20.25-34.75 20.26 1.39 20.26 15.18-9.1 29.37-20.29 34.78Zm0-55.64c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.4 20.26 15.19-9.1 29.37-20.29 34.77Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.1 29.37-20.29 34.77Zm0-55.64c-11.19 5.41-20.26-1.39-20.26-15.18s9.07-29.35 20.26-34.76 20.26 1.4 20.26 15.19-9.1 29.37-20.29 34.77Zm0-55.63c-11.19 5.4-20.26-1.4-20.26-15.19s9.07-29.35 20.26-34.75 20.26 1.39 20.26 15.18-9.1 29.37-20.29 34.78Z"
        transform="translate(-92 -4)"
      />
    </svg>
  );
};

export default Home;
