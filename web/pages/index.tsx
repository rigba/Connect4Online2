import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import Lobby from "../components/Landing/Lobby";
import Taskbar from "../components/Taskbar";



const Home: NextPage = () => {
  return (
    <div className="mx-4">
      <Taskbar />
      <div className="flex justify-center my-10 gap-5 rounded-md bg-slate-800 max-w-4xl mx-auto py-10 group inner-shadow-lg " >
        <Lobby/>
      </div>
    </div>
  );
};

export default Home;
