import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  HandRaisedIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState, Fragment } from "react";

export const myUser = { id: 1, username: "bob" };

const Taskbar = ({ passUser }: { passUser? }) => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    setUser(myUser);
    if (!passUser) {
      return;
    }
    passUser(user);
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

      <button className="shadow-md group inline-flex items-center rounded-md bg-red-500 text-base font-medium text-white mr-2 h-full px-3 py-3 my-auto">
        <PlusIcon
          className="h-5 w-5 transition duration-150 ease-in-out text-opacity-70 text-white group-hover:text-opacity-100"
          aria-hidden="true"
        />
      </button>
      <Menu as="div" className="relative my-auto">
        <>
          <Menu.Button
            className={` shadow-md
          group inline-flex items-center rounded-md bg-blue-700 text-base font-medium text-white hover:text-opacity-100 px-3 py-3`}
          >
            <UserIcon
              className={`
            h-5 w-5 text-white transition duration-150 ease-in-out group-hover:text-opacity-100`}
              aria-hidden="true"
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {user === undefined ? (
                <>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({}) => (
                        <button
                          className={`text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <UserIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({}) => (
                        <button
                          className={`text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm `}
                        >
                          <HandRaisedIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          {`Welcome back ${user.username.toUpperCase()}! `}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-400 text-white" : "text-blue-500"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <PencilIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          Edit Username
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-400 text-white" : "text-red-500"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <TrashIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          Delete Account
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </>
              )}
            </Menu.Items>
          </Transition>
        </>
      </Menu>
    </div>
  );
};

export default Taskbar;
