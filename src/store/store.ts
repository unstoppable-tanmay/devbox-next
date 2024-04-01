import { create } from "zustand";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";

type user = {
  name: string;
  email: string;
  id?: string;
  username: string;
  password?: string;
};

type code = {
  code?: string;
  lang?: string;
  input?: string;
  output?: string;
};

type chats = {
  user?: string;
  time?: string;
  chat?: string;
};

export type room = {
  roomId?: string;
  admin?: { socketId: string; user: user };
  users?: { socketId: string; user: user }[] | [];
  allowOthers?: boolean;
  code?: code;
  chats?: chats[];
  usersId?: string[];
};

type store = {
  user: user;
  setUser: (user: user) => void;

  invitedUser: string[];
  setInvitedUser: (invitedUser: string[]) => void;

  isUser: boolean;
  setIsUser: (isUser: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  socket: Socket;

  room: room | null;
  setRoom: (room: room | null) => void;

  socketId: string;
  setSocketId: (room: string) => void;

  joined: boolean;
  setJoined: (joined: boolean) => void;

  inviteUser: { name: string; email: string; color: string }[];
  setInviteUser: (
    inviteUser: { name: string; email: string; color: string }[]
  ) => void;

  allow: boolean;
  setAllow: (allow: boolean) => void;

  userEmail: string;
  setUserEmail: (userEmail: string) => void;
};

export const useStore = create<store>((set) => ({
  user: { name: "", email: "", id: "", username: "" },
  setUser: (user) => set((state) => ({ user: user })),

  invitedUser: [],
  setInvitedUser: (invitedUser: string[]) => set((state) => ({ invitedUser })),

  isUser: false,
  setIsUser: (isUser) => set((state) => ({ isUser })),

  loading: true,
  setLoading: (loading) => set((state) => ({ loading })),

  socket: io(process.env.SOCKET_URL || "http://localhost:3001", {
    autoConnect: false,
  }),

  room: null,
  setRoom: (room) => set((state) => ({ room })),

  socketId: "",
  setSocketId: (socketId) => set((state) => ({ socketId })),

  joined: false,
  setJoined: (joined) => set((state) => ({ joined })),

  inviteUser: [],
  setInviteUser: (inviteUser) => set((state) => ({ inviteUser })),

  allow: false,
  setAllow: (allow: boolean) => set((state) => ({ allow })),

  userEmail: "",
  setUserEmail: (userEmail: string) => set((state) => ({ userEmail })),
}));
