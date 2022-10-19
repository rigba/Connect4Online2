import { Popover, Transition } from "@headlessui/react";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export const myUser = { id: 1, username: "bob" };

const Taskbar = ({ passUser }: {passUser?}) => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    setUser(myUser);
    if (!passUser){
      return
    }
    passUser(user)
  }, [user]);

  return (
    <div className="flex rounded-xl mx-auto max-w-4xl shadow-lg my-5 bg-gray-700 p-4 px-4">
      <text className="text-2xl md:text-5xl public-xl text-slate-100 mr-auto my-auto shadow-md">
        <div className="bg-blue-700 grid grid-flow-col gap-3 py-1 px-4 rounded-md">
          <h1 className="text-red-500 my-auto">C</h1>
          <h1 className="text-yellow-500 m-auto">F</h1>
          <h1 className="text-blue-900 m-auto">O</h1>
          <svg
            className="h-full pt-2 pb-1 mx-auto m-auto"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="fill-red-500" cx="50" cy="50" r="45" />
          </svg>
        </div>
      </text>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
          ${open ? "" : "text-opacity-90"}
          group inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 h-full`}
            >
              <UserIcon
                className={`${open ? "" : "text-opacity-70"}
            h-5 w-5 text-white transition duration-150 ease-in-out group-hover:text-opacity-100`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 text-black">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  {user === undefined ? (
                    <>
                      <div className="relative bg-white p-7 lg:grid-cols-2">
                        You are currently not logged in!
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative bg-white p-7 lg:grid-cols-2">
                        {`Welcome back ${user.username.toUpperCase()}! `}
                      </div>
                      <div className="relative grid gap-4 bg-white p-7 lg:grid-cols-2">
                        <button className="flex center text-blue-600 outline rounded-lg w-full ring-0 focus:ring-8 ring-blue-300">
                          <PencilSquareIcon
                            /* for editing name */
                            className="text-opacity-70 h-8 w-8 my-auto mx-2"
                            aria-hidden="true"
                          />
                          Username Change
                        </button>
                        <button className="flex center text-rose-600 outline rounded-lg ring-0 focus:ring-8 ring-rose-300">
                          <TrashIcon
                            /* for deleting account */
                            className="text-opacity-70 h-8 w-8 my-auto mx-2"
                            aria-hidden="true"
                          />
                          Delete Account
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <button className="group inline-flex items-center rounded-md bg-rose-400 px-3 py-2 text-base font-medium text-white ml-2">
        <PlusIcon
          className="h-5 w-5 transition duration-150 ease-in-out text-opacity-70 text-white group-hover:text-opacity-100"
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default Taskbar;
