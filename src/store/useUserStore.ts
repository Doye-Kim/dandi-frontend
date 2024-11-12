import { create } from 'zustand';

interface UserState {
  isLogin: boolean;
  nickname: string;
  email: string;
  id: number;
  setIsLogin: (isLogin: boolean) => void;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setId: (id: number) => void;
  reset: () => void;
}
const useUserStore = create<UserState>((set) => ({
  isLogin: false,
  nickname: '',
  email: '',
  id: 0,
  setIsLogin: (isLogin: boolean) => {
    set({ isLogin });
  },
  setNickname: (nickname: string) => {
    set({ nickname });
  },
  setEmail: (email: string) => {
    set({ email });
  },
  setId: (id: number) => {
    set({ id });
  },
  reset: () => set({ isLogin: false, nickname: '', email: '', id: 0 }),
}));

export default useUserStore;
