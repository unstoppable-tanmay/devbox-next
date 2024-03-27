"use client";

import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [login, setLogin] = useState(true);
  const { isUser, loading, setIsUser, setLoading, setUser, user } = useStore();

  useEffect(() => {
    const signin = async () => {
      try {
        const response = await axios.get("http://localhost:3002/auth", {
          withCredentials: true,
        });

        if (response.data) {
          setIsUser(true);
          setUser(response.data.data);
          console.log(response.data.message);
        }

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    signin().finally(() => {
      setLoading(false);
    });
  }, [setLoading, setIsUser, setUser]);

  const Login = () => {};

  return !loading ? (
    isUser ? (
      <main className="w-screen min-h-screen flex items-center flex-col">
        <div className="w-screen flex items-center justify-between px-10 font-bold text-lg py-4">
          Dev-Box <div className="heading font-bold text-xl">{user.name}</div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="createRoom flex flex-col gap-4 p-4 items-center justify-center">
            <div className="heading text-xl font-semibold mb-4">
              Create Room
            </div>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>

            <label
              htmlFor="invite"
              className="room-id-input pl-3 rounded-md text-white bg-white/20 w-[350px] max-w-[90vw] flex overflow-hidden"
            >
              <input
                id="invite"
                placeholder="Enter email of peoples to invite."
                className="outline-none border-none bg-transparent flex-1 tetx-sm py-2"
                type="text"
              />
              <button className="add h-full px-2 py-2 flex items-center justify-center bg-white/30">
                add
              </button>
            </label>

            <button className="room-id-input px-4 py-2 rounded-md text-white bg-green-500/40 w-[350px] max-w-[90vw] active:scale-[0.975]  duration-200 transition-all">
              {" "}
              Create
            </button>
          </div>
        </div>
      </main>
    ) : (
      <main className="flex w-screen min-h-screen items-center flex-col overflow-x-hidden">
        <div className="w-screen flex items-center justify-center font-bold text-lg py-4">
          Dev-Box
        </div>
        <div className="content min-h-[90vh] flex w-full h-full items-center justify-around flex-1 flex-wrap">
          <div className="Heading flex flex-col gap-2 items-center md:items-start text-[clamp(40px,6vw,120px)] font-black leading-tight tracking-wider select-none">
            <div className="heading1">Code.</div>
            <div className="heading1">Compile.</div>
            <div className="heading1">Collaborate.</div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e);
            }}
            className="login p-6 border-2 border-gray-500 rounded-xl shadow-2xl shadow-blue-500/20 duration-300 hover:shadow-blue-500/50 min-w-[300px] flex flex-col gap-3 text-xs"
          >
            <div className="heading text-base">
              {login ? "Log In" : "Sign Up"}
            </div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
            />
            {!login && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
                />
              </>
            )}
            <input
              type="text"
              name="password"
              placeholder="Password"
              className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-600/30 hover:bg-green-600/40 duration-200 px-3 py-2 rounded-md"
            >
              {login ? "Log In" : "Sign Up"}
            </button>
            <div className="signin text-blue-500 w-full text-center">
              <span
                className="cursor-pointer "
                onClick={(e) => setLogin(!login)}
              >
                {!login ? "Log In" : "Sign Up"}
              </span>
            </div>
          </form>
        </div>
      </main>
    )
  ) : (
    <div className="w-screen h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}
