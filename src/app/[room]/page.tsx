/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useWindowSize from "@rooks/use-window-size";
import { RxDividerHorizontal, RxDividerVertical } from "react-icons/rx";
import { FaUserMinus, FaUser } from "react-icons/fa6";
import { HiCog6Tooth } from "react-icons/hi2";
import { IoClose, IoSend } from "react-icons/io5";
import { Editor, Monaco } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { TbTriangleFilled } from "react-icons/tb";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

function SafeHydrate({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

export async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(() => resolve(""), ms)).then(() =>
    console.log("fired")
  );
}

const Language = [
  "json",
  "markdown",
  "css",
  "typescript",
  "javascript",
  "html",
  "python",
  "scss",
  "cpp",
  "csharp",
  "dart",
  "go",
  "java",
  "kotlin",
  "perl",
  "php",
  "ruby",
  "rust",
  "swift",
  "c",
];
const Language_to_Extension = new Map();

Language_to_Extension.set("json", "json");
Language_to_Extension.set("markdown", "md");
Language_to_Extension.set("css", "css");
Language_to_Extension.set("typescript", "ts");
Language_to_Extension.set("javascript", "js");
Language_to_Extension.set("html", "html");
Language_to_Extension.set("python", "py");
Language_to_Extension.set("scss", "scss");
Language_to_Extension.set("cpp", "cpp");
Language_to_Extension.set("csharp", "cs");
Language_to_Extension.set("dart", "dart");
Language_to_Extension.set("go", "go");
Language_to_Extension.set("java", "java");
Language_to_Extension.set("kotlin", "kt");
Language_to_Extension.set("perl", "pl");
Language_to_Extension.set("php", "php");
Language_to_Extension.set("ruby", "rb");
Language_to_Extension.set("rust", "rs");
Language_to_Extension.set("swift", "swift");
Language_to_Extension.set("c", "c");

const Page = ({ params }: { params: { room: string } }) => {
  const router = useRouter();
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
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const chatref = useRef<HTMLDivElement>(null);

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco?.editor.defineTheme("my-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000",
      },
    });

    monaco?.editor.setTheme("my-theme");
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
        "http://localhost:3002/isUser",
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

  const updateRoom = async () => {
    socket.emit("update_room", {
      roomId: room?.roomId,
      allowOthers: allow,
      invitedUsers: inviteUser.map((e) => e.email),
    });
  };

  useEffect(() => {
    if (innerWidth! < 1000) setIsMobile(true);
    else setIsMobile(false);
  }, [innerWidth]);

  useEffect(() => {
    socket.on("joined_room", (data) => {
      console.log("joined");
      setRoom(data);
      setJoined(true);
    });
    socket.on("socketId", (data) => {
      console.log(data)
      setSocketId(data.id);
    });
    socket.on("removed", (data) => {
      console.log(socket.id+" ============= "+data)
      if (socket.id === data) {
        socket.disconnect();
        setJoined(false);
        setRoom(null);
        router.replace("/");
      }
    });
    socket.on("room_updated", (data) => {
      setSettingsOpen(false);
    });
    socket.on("error", (data) => {
      console.log(data);
      socket.disconnect();
      setJoined(false);
      setRoom(null);
      router.replace("/");
    });
    socket.on("message", (data) => {
      console.log(data);
    });
    socket.on("update", (data) => {
      console.log(data);
      setRoom(data);
      if (chatref.current)
        chatref.current!.scrollBy({
          top: 400,
          behavior: "smooth",
        });
    });
  }, []);

  useEffect(() => {
    socket.connect();
    const signin = async () => {
      try {
        if (!isUser) {
          const response = await axios.get("http://localhost:3002/auth", {
            withCredentials: true,
          });

          if (response.data) {
            setIsUser(true);
            setUser(response.data.data);
            toast({
              title: "User Logged In",
              description: "code better",
            });
          }

          if (!response.data) {
            console.log("Not User");
            router.replace("/");
          }
          if (!/[a-z]{3}-[a-z]{3}-[a-z]{3}/g.test(params.room)) {
            console.log("Not Good Format");
            router.replace("/");
          }
          console.log("Going TO Emit room exits");
          socket.emit("room_exits", params.room);

          socket.on("room_query", (data: boolean) => {
            console.log(data);
            if (!data) {
              alert("you are not allowed");
              router.replace("/");
              return;
            }
            console.log(socket.id)
            socket.emit("join_room", {
              roomId: params.room,
              user: { socketId: socket.id, user: response.data.data },
            });
          });
        }
      } catch (error) {
        console.log(error);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    if (!isUser)
      signin().finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (joined) socket.emit("update", room);
  }, [room]);

  return (
    <SafeHydrate>
      <main className="flex min-h-screen items-center flex-col overflow-x-hidden relative">
        {loading && (
          <div className="loader bg-black/70 backdrop-blur-md w-screen h-screen top-0 left-0 flex items-center justify-center fixed">
            Loading...
          </div>
        )}
        <div className="w-screen flex items-center justify-between px-4 font-bold text-lg py-4">
          <span className="hidden md:flex">Dev-Box</span>
          <div className="room font-normal text-base flex gap-2 items-center">
            {params.room}
          </div>
          <div className="buttons flex gap-1">
            <Button
              onClick={() => {
                socket.disconnect();
                setJoined(false);
                setRoom(null);
                router.replace("/");
              }}
              className="bg-red-400/20 hover:bg-red-400/30"
            >
              Leave
            </Button>
            {/* Chat */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger>
                  <DialogTrigger asChild>
                    <Button>Chat</Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat With Room</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="bg-black border-white/40 max-w-[clamp(200px,400px,90vw)] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Chats</DialogTitle>
                </DialogHeader>
                <DialogClose className="border-none" />
                <ScrollArea ref={chatref} className="w-full h-[60vh] -mt-5">
                  {room?.chats?.map((e) => {
                    return (
                      <div className="flex gap-2 w-full my-2 " key={e.time}>
                        <div className="span aspect-square text-lg rounded-full bg-white/20 flex items-center justify-center h-9">
                          {e.user![0].toUpperCase()}
                        </div>
                        <div className="messageBox bg-white/30 flex flex-col rounded-md p-2">
                          <div className="text-xs">{e.user}</div>
                          <div className="message text-sm text-white/50">
                            {e.chat}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
                <div className="messagebox flex gap-2 w-full">
                  <input
                    type="text"
                    className="flex-1 bg-white/10 border-none outline-none rounded-full text-sm px-4 py-2"
                    onChange={(e) => {
                      setChatInput(e.target.value);
                    }}
                  />
                  <button
                    className="aspect-square h-full rounded-full bg-white/20 flex items-center justify-center"
                    onClick={(e) => {
                      setRoom({
                        ...room,
                        chats: [
                          ...room?.chats!,
                          {
                            chat: chatInput,
                            time: Date.now().toString(),
                            user: user.name,
                          },
                        ],
                      });
                    }}
                  >
                    <IoSend />
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Settings */}
            <Dialog
              open={settingsOpen}
              onOpenChange={(e) => setSettingsOpen(e)}
            >
              <Tooltip>
                <TooltipTrigger>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSettingsOpen(true)}>
                      <HiCog6Tooth />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="bg-black border-white/40 max-w-[clamp(200px,400px,90vw)] p-4 rounded-lg">
                <DialogHeader>
                  <DialogTitle>Update Room</DialogTitle>
                  <DialogClose className="border-none" />
                </DialogHeader>
                <div className="createRoom flex flex-col gap-4 items-center justify-center">
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

                  {inviteUser.length ? (
                    <div className="flex w-full flex-wrap items-center justify-center gap-3">
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
                  ) : (
                    <></>
                  )}
                  <label
                    htmlFor="invite"
                    className="room-id-input rounded-md text-white bg-white/20 w-full flex overflow-hidden"
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
                    className="room-id-input px-4 py-2 rounded-md text-white bg-green-500/40 w-full active:scale-[0.975]  duration-100 transition-all"
                    onClick={updateRoom}
                  >
                    Update
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Users */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger>
                  <DialogTrigger asChild>
                    <Button>
                      <FaUser />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Users</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="bg-black border-white/40 max-w-[clamp(200px,400px,90vw)] p-4 rounded-lg">
                <DialogHeader>
                  <DialogTitle>Users</DialogTitle>
                  <DialogClose className="border-none" />
                </DialogHeader>
                <ScrollArea className="flex flex-col w-full h-full gap-4">
                  {room?.users?.map((e) => {
                    return (
                      <div
                        className="user p-2 px-4 rounded-md bg-white/20 flex justify-between items-center"
                        key={e.socketId}
                      >
                        <h3 className="text-sm">{e.user.name}</h3>
                        {room.admin?.socketId === socket.id &&
                          socket.id != e.socketId && (
                            <FaUserMinus
                              onClick={(g) => {
                                socket.emit("remove_from_room", {
                                  roomId: room.roomId,
                                  userSocketId: e.socketId,
                                  adminSocketId: socket.id,
                                });
                              }}
                            />
                          )}
                      </div>
                    );
                  })}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <PanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="flex-1 h-full gap-1 px-3"
        >
          <Panel
            defaultSize={70}
            className="full rounded-md border-2 border-white/20 flex flex-col"
          >
            {/* Code */}
            <div className="topbar flex justify-between items-center px-3 py-2">
              <Select
                value={room?.code?.lang}
                onValueChange={(e) => {
                  setRoom({ ...room, code: { ...room?.code, lang: e } });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {Language.map((e) => {
                    return (
                      <SelectItem className="capitalize" value={e} key={e}>
                        {e}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={(e) => {
                      socket.emit("compile");
                    }}
                  >
                    <TbTriangleFilled className="rotate-90" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run Code</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="editor-wrapper w-full h-max flex-1">
              <Editor
                className="w-full max-h-full py-4"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                theme="my-theme"
                beforeMount={handleEditorDidMount}
                value={room?.code?.code}
                onChange={(data) => {
                  setRoom({ ...room, code: { ...room?.code, code: data } });
                }}
                language={room?.code?.lang}
              />
            </div>
          </Panel>
          <PanelResizeHandle className="flex items-center justify-center hover:bg-blue-400/30 duration-300 rounded-full">
            {isMobile ? <RxDividerHorizontal /> : <RxDividerVertical />}
          </PanelResizeHandle>
          <Panel className="full">
            <PanelGroup direction="vertical" className="flex-1 h-full gap-1">
              <Panel
                defaultSize={50}
                className="full rounded-md border-2 border-white/20"
              >
                {/* Input */}
                <textarea
                  name=""
                  placeholder="input ~"
                  id=""
                  className="resize-none w-full h-full p-4 font-mono text-sm bg-transparent"
                  value={room?.code?.input}
                  onChange={(data) => {
                    setRoom({
                      ...room,
                      code: { ...room!.code, input: data.target.value },
                    });
                  }}
                ></textarea>
              </Panel>
              <PanelResizeHandle className="flex items-center justify-center hover:bg-blue-400/30 duration-300 rounded-full">
                <RxDividerHorizontal />
              </PanelResizeHandle>
              <Panel className="full rounded-md border-2 border-white/20">
                {/* Output */}
                <textarea
                  name=""
                  placeholder="output ~"
                  id=""
                  className="resize-none w-full h-full p-4 font-mono text-sm bg-transparent"
                  disabled
                  value={room?.code?.output}
                ></textarea>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>
    </SafeHydrate>
  );
};

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});

// export default Page;
