import { create } from "zustand";

type user = { name: string; email: string; id: string; username: string };

type store = {
  user: user;
  setUser: (user: user) => void;

  isUser: boolean;
  setIsUser: (isUser: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useStore = create<store>((set) => ({
  user: { name: "", email: "", id: "", username: "" },
  setUser: (user) => set((state) => ({ user: user })),

  isUser: false,
  setIsUser: (isUser) => set((state) => ({ isUser })),

  loading: true,
  setLoading: (loading) => set((state) => ({ loading })),
}));
