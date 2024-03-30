import { create } from "zustand";
import { Socket, io } from "socket.io-client";

type user = {
  name: string;
  email: string;
  id?: string;
  username: string;
  password?: string;
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

  room: string;
  setRoom: (room: string) => void;

  socketId: string;
  setSocketId: (room: string) => void;
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

  room: "",
  setRoom: (room) => set((state) => ({ room })),

  socketId: "",
  setSocketId: (socketId) => set((state) => ({ socketId })),
}));
