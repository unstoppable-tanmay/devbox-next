"use client";

import { useStore } from "@/store/store";
import { MouseEventHandler, useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useCookies } from "react-cookie";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Home() {
  const { toast } = useToast();
  const [login, setLogin] = useState(true);
  const {
    isUser,
    loading,
    setIsUser,
    setLoading,
    setUser,
    user,
    socket,
    setRoom,
    room,
    setSocketId,
    socketId,
    joined,
    setJoined,
    allow,
    inviteUser,
    invitedUser,
    setAllow,
    setInviteUser,
    setInvitedUser,
    setUserEmail,
    userEmail,
  } = useStore();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const router = useRouter();

  axios.defaults.timeout = 5000;

  // JWT signin
  useEffect(() => {
    setLoading(true);
    const signin = async () => {
      try {
        const response = await axios.get(
          process.env.BACKEND_URL
            ? process.env.BACKEND_URL + "/auth"
            : "http://localhost:3002/auth",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setIsUser(true);
          setUser(response.data.data);
          toast({
            title: "User Logged In",
            description: "code better",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!isUser)
      signin().finally(() => {
        setLoading(false);
      });
  }, [setLoading, setIsUser, setUser, toast, isUser]);

  // Register
  const Register = async () => {
    setLoading(true);
    try {
      if (!user.email)
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Enter Email",
          description: "code better",
        });
      if (!user.name)
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Enter Name",
          description: "code better",
        });
      if (!user.password)
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Enter Password",
          description: "code better",
        });
      if (!user.username)
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Enter User Name",
          description: "code better",
        });

      const response = await axios.post(
        process.env.BACKEND_URL
          ? process.env.BACKEND_URL + "/auth/register"
          : "http://localhost:3002/auth/register",
        user,
        { withCredentials: true }
      );

      if (response.data) {
        setIsUser(true);
        setUser(response.data.data);
        toast({
          duration: 2000,
          title: "User Create & Logged In",
          description: "code better",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const Login = async () => {
    setLoading(true);
    try {
      if (!user.password)
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Enter Password",
          description: "code better",
        });
      if (!user.username)
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Enter User Name",
          description: "code better",
        });

      const response = await axios.post(
        process.env.BACKEND_URL
          ? process.env.BACKEND_URL + "/auth/login"
          : "http://localhost:3002/auth/login",
        user,
        { withCredentials: true }
      );

      if (response.data && response.data.data) {
        setIsUser(true);
        setUser(response.data.data);
        setLoading(false);
        toast({
          duration: 2000,
          title: "User Logged In",
          description: "code better",
        });
        setLoading(false);
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          duration: 2000,
          title: response.data.message,
          description: "code better",
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast({
        variant: "destructive",
        duration: 2000,
        title: error.response
          ? error.response.data.message
          : "Some Error Happened",
        description: "code better",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const Logout = () => {
    setLoading(true);
    try {
      removeCookie("token");
      setIsUser(false);
      setUser({ email: "", name: "", username: "", password: "" });
      setInviteUser([]);
      setUserEmail("");
      toast({
        title: "User Logged Out",
        description: "code better",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async () => {
    try {
      if (inviteUser.find((v) => v.email == userEmail)) {
        toast({
          variant: "destructive",
          duration: 2000,
          title: "Already Invited",
        });
        return;
      }
      const response = await axios.post(
        process.env.BACKEND_URL
          ? process.env.BACKEND_URL + "isUser"
          : "http://localhost:3002/isUser",
        {
          email: userEmail,
          useremail: user.email,
        },
        { withCredentials: true }
      );

      console.log(response.data);

      if (response && response.data.data) {
        setInviteUser([
          ...inviteUser,
          {
            ...response.data.data,
            color: `${
              "#" +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
            }`,
          },
        ]);
      } else {
        toast({
          variant: "destructive",
          duration: 1000,
          title: "Error",
          description: response.data.message,
        });
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast({
        variant: "destructive",
        duration: 2000,
        title: error.response
          ? error.response.data.message
          : error.message
          ? error.message
          : "Some Error Happened",
        description: "code better",
      });
    }
  };

  const createRoom = async () => {
    setLoading(true);
    socket.emit("create_room", {
      admin: { socketId: socket.id, user },
      allowOthers: allow,
      invitedUsers: inviteUser.map((e) => e.email),
    });
  };

  useEffect(() => {
    socket.connect();
    socket.on("socketId", (data) => {
      setSocketId(data.id);
    });
    socket.on("room_created", (data) => {
      setRoom(data);
      console.log(data);
      setJoined(true);
      setLoading(false);
      router.push(`/${data?.roomId!}`);
    });
    socket.on("message", (data) => {
      console.log(data);
    });
  }, []);

  return isUser ? (
    <>
      {loading ? (
        <div className="loader bg-black/70 backdrop-blur-md w-screen h-screen top-0 left-0 flex items-center justify-center">
          Loading...
        </div>
      ):<></>}
      <main className="w-screen min-h-screen flex items-center flex-col relative">
        <div className="w-screen flex items-center justify-between px-10 font-bold text-lg py-4 flex-wrap">
          Dev-Box
          <div className="flex gap-4">
            <div className="heading font-bold text-lg">{user.name}</div>{" "}
            <div
              onClick={Logout}
              className="logout px-4 py-1.5 bg-red-400 rounded-md text-sm cursor-pointer active:scale-[.98] select-none duration-100"
            >
              Logout
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="createRoom flex flex-col gap-4 p-4 items-center justify-center">
            <div className="heading text-xl font-semibold mb-4">
              Create Room
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={allow}
                onCheckedChange={(e) => setAllow(e as boolean)}
                id="terms"
                className="border-[1px] border-white rounded-sm"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
                Allow Others to Join Your Room
              </label>
            </div>

            <div className="flex w-[400px] max-w-[90vw] flex-wrap items-center justify-center gap-3">
              {inviteUser.map((e, i) => {
                return (
                  <span
                    key={i}
                    style={{
                      background: e.color,
                    }}
                    className={`pl-1 pr-2 py-1 text-xs bg-opacity-20 rounded-full flex items-center justify-center font-bold`}
                  >
                    <span className="badge bg-white/60 rounded-full text-[10px] h-full aspect-square mr-1 flex items-center justify-center px-2">
                      {e.name[0].toUpperCase()}
                    </span>
                    {e.name}
                    <IoClose
                      className="text-lg ml-2 cursor-pointer text-orange-500"
                      onClick={(a) => {
                        setInviteUser(
                          inviteUser.filter((c) => c.email != e.email)
                        );
                      }}
                    />
                  </span>
                );
              })}
            </div>
            <label
              htmlFor="invite"
              className="room-id-input rounded-md text-white bg-white/20 w-[350px] max-w-[90vw] flex overflow-hidden"
            >
              <input
                id="invite"
                placeholder="Enter email of peoples to invite."
                className="pl-3 outline-none border-none bg-transparent flex-1 text-sm py-2 leading-none"
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <button
                onClick={(e) => addEmail()}
                className="add h-full px-2 py-2 flex items-center justify-center bg-white/30"
              >
                add
              </button>
            </label>

            <button
              className="room-id-input px-4 py-2 rounded-md text-white bg-green-500/40 w-[350px] max-w-[90vw] active:scale-[0.975]  duration-100 transition-all"
              onClick={createRoom}
            >
              Create
            </button>
          </div>
        </div>
      </main>
    </>
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
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   console.log(e);
          // }}
          className="login p-6 border-2 border-gray-500 rounded-xl shadow-2xl shadow-blue-500/20 duration-300 hover:shadow-blue-500/50 min-w-[300px] flex flex-col gap-3 text-xs"
        >
          <div className="heading text-base">
            {login ? "Log In" : "Sign Up"}
          </div>
          <input
            type="text"
            name="username"
            value={user.username}
            placeholder="User Name"
            className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
            onChange={(e) => {
              if (/^[a-z-.]*$/.test(e.target.value))
                setUser({ ...user, username: e.target.value });
            }}
          />
          {!login && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
                onChange={(e) => {
                  setUser({ ...user, name: e.target.value });
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                }}
              />
            </>
          )}
          <input
            type="text"
            name="password"
            placeholder="Password"
            className="outline-none border-0 px-3 py-2 bg-white/20 rounded-md"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
          <button
            className="bg-green-600/30 hover:bg-green-600/40 duration-200 px-3 py-2 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              login ? Login() : Register();
            }}
          >
            {login ? "Log In" : "Sign Up"}
          </button>
          <div className="signin text-blue-500 w-full text-center">
            <span className="cursor-pointer " onClick={(e) => setLogin(!login)}>
              {!login ? "Log In" : "Sign Up"}
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}
