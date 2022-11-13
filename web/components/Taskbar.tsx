import { ApolloQueryResult, useMutation, useQuery } from "@apollo/client";
import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  HandRaisedIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import {
  CreateGameDocument,
  MeDocument,
  MeQuery,
  User,
} from "../graphql/generated/graphql";

const Taskbar = ({ passUser }: { passUser? }) => {
  const meRes = useQuery(MeDocument, { ssr: true });
  const [createGame, createGameInfo] = useMutation(CreateGameDocument);
  const router = useRouter();
  const [deletePrompt, setDeletePrompt] = useState(true);
  const [renamePrompt, setRenamePrompt] = useState(true);

  useEffect(() => {
    const getMe = async () => {
      try {
        let res = await meRes.refetch();
      } catch {}
    };
    getMe();
    if (!passUser) return;
    passUser(meRes);
  }, [meRes.data]);

  const createGameHelper = async () => {
    let game = await createGame();
    if (!game.data) return;
    router.replace(`/game/${game.data.createGame.gameUUID}`);
  };

  return (
    <div className="flex rounded-xl mx-auto max-w-4xl my-5 bg-slate-800 p-4 px-4">
      <button className="text-3xl md:text-5xl font-public-xl mr-auto my-auto">
        <div className="bg-blue-700 flex flex-row gap-3 py-2 md:py-1 px-4 rounded-md shadow-md">
          <h1 className="text-red-500 my-auto">C</h1>
          <h1 className="text-yellow-500 m-auto">F</h1>
          <h1 className="text-blue-900 m-auto">O</h1>
          <svg
            className="h-full w-6 md:w-10 pt-2 pb-1 mx-auto m-auto"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="fill-red-500" cx="50" cy="50" r="45" />
          </svg>
        </div>
      </button>
      {meRes.data && !router.asPath.includes("game") && (
        <button
          onClick={() => createGameHelper()}
          className="shadow-md group inline-flex items-center rounded-md bg-red-500 text-base font-medium text-white mr-2 h-full px-3 py-3 my-auto"
        >
          {createGameInfo?.loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-red-600 animate-spin fill-white mx-auto"
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
          ) : (
            <PlusIcon
              className="h-5 w-5 transition duration-150 ease-in-out text-opacity-70 text-white group-hover:text-opacity-100"
              aria-hidden="true"
            />
          )}
        </button>
      )}

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
            <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {!meRes.data?.me ? (
                <>
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({}) => (
                        <div className="text-gray-600 p-4 font-public-lg">
                          You aren't logged in
                        </div>
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
                          {`Welcome back ${meRes.data.me.username.toUpperCase()}! `}
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
