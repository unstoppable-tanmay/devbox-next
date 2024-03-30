"use client";

import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useWindowSize from "@rooks/use-window-size";
import { RxDividerHorizontal, RxDividerVertical } from "react-icons/rx";
import { IoChatbubbleSharp, IoExit, IoSend } from "react-icons/io5";
import { Editor, Monaco } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { TbTriangleFilled } from "react-icons/tb";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  } = useStore();
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [chatDrawer, setChatDrawer] = useState(false);

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

  useEffect(() => {
    if (innerWidth! < 1000) setIsMobile(true);
    else setIsMobile(false);
  }, [innerWidth]);

  useEffect(() => {
    socket.emit("create_room", { room, name: user.name, email: user.email });
  }, [socket, room, user]);
  return (
    <SafeHydrate>
      <main className="flex min-h-screen items-center flex-col overflow-x-hidden">
        <div className="w-screen flex items-center justify-between px-4 font-bold text-lg py-4">
          <span>Dev-Box</span>
          <div className="room font-normal text-base flex gap-2 items-center">
            {params.room}
            <Button>
              <TbTriangleFilled className="rotate-90" />
            </Button>
          </div>
          <div className="buttons flex gap-1">
            <Button className="bg-red-400/20 hover:bg-red-400/30">Leave</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Chat</Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-white/40">
                <DialogHeader>
                  <DialogTitle>Chats</DialogTitle>
                </DialogHeader>
                <DialogClose className="border-none" />
                <ScrollArea className="w-full h-[60vh] -mt-5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Inventore nostrum sint incidunt at. Voluptatum nihil eos animi
                  porro numquam maiores voluptatibus ipsa, assumenda totam,
                  vitae cupiditate a eaque perferendis voluptates. Ex odit
                  consequuntur maxime aperiam at totam facilis iste possimus
                  porro? Tenetur aliquam doloribus provident hic? Iste rem
                  eveniet dignissimos deleniti ab. Id blanditiis eos ipsam
                  veritatis quam minima consectetur, corporis dolorum eligendi
                  doloremque nostrum ducimus asperiores obcaecati minus est
                  sequi quos quaerat perspiciatis eius in molestias! Neque
                  rerum, soluta quasi repellendus enim pariatur natus sint
                  impedit dignissimos reprehenderit temporibus eligendi esse
                  fugit voluptatibus accusamus magnam odio dolores error
                  ducimus! Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Voluptates alias, iste facere amet reiciendis inventore
                  sapiente consequatur voluptatem ex dolores. Maxime quo quis
                  quia voluptatem! Excepturi repudiandae, rerum voluptatum
                  quisquam temporibus unde omnis. Nostrum iste, inventore ut
                  placeat, autem recusandae a obcaecati culpa explicabo
                  consequuntur dolor, porro officiis! Labore aliquid asperiores
                  quod. Aperiam hic error ipsa quam quo laudantium libero
                  explicabo ipsam! Et debitis tempora, perspiciatis in unde
                  inventore consequuntur deleniti at nesciunt consequatur ipsa
                  non possimus expedita sit? Animi, provident aspernatur? Sit
                  doloremque magni totam blanditiis accusantium unde dolores
                  vitae, hic, pariatur sint perferendis ex voluptatum, similique
                  facere sequi?
                </ScrollArea>
                <div className="messagebox flex gap-2 w-full">
                  <input
                    type="text"
                    className="flex-1 bg-white/10 border-none outline-none rounded-full text-sm px-4 py-2"
                  />
                  <button className="aspect-square h-full rounded-full bg-white/20 flex items-center justify-center">
                    <IoSend />
                  </button>
                </div>
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
            className="full rounded-md border-2 border-white/20"
          >
            {/* Code */}
            <Editor
              className="w-full max-h-full py-4"
              defaultLanguage="javascript"
              defaultValue="// some comment"
              theme="my-theme"
              beforeMount={handleEditorDidMount}
              // value={code}
              // onChange={(data) => {
              //   socket.current!.emit("update_code", {
              //     room: room,
              //     name: name,
              //     id: id,
              //     code: data,
              //   });
              // }}
              language={"javascript"}
            />
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
                  placeholder="hello some outputs are here"
                  id=""
                  className="resize-none w-full h-full p-4 font-mono text-sm bg-transparent"
                ></textarea>
              </Panel>
              <PanelResizeHandle className="flex items-center justify-center hover:bg-blue-400/30 duration-300 rounded-full">
                <RxDividerHorizontal />
              </PanelResizeHandle>
              <Panel className="full rounded-md border-2 border-white/20">
                {/* Output */}
                <textarea
                  name=""
                  placeholder="hello some outputs are here"
                  id=""
                  className="resize-none w-full h-full p-4 font-mono text-sm bg-transparent"
                  disabled
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
