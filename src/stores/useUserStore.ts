import { create } from 'zustand';

type UserStore = {
  userId: string | null;
  isLoggedIn: boolean;
  setUserId: (id: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>(set => ({
  userId: null,
  isLoggedIn: false,
  setUserId: id => set({ userId: id, isLoggedIn: true }),
  logout: () => set({ userId: null, isLoggedIn: false }),
}));
