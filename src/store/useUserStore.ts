import { create } from 'zustand';

interface UserState {
  isLogin: boolean;
  nickname: string;
  email: string;
  setIsLogin: (isLogin: boolean) => void;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}
const useUserStore = create<UserState>((set) => ({
  isLogin: false,
  nickname: '',
  email: '',
  setIsLogin: (isLogin: boolean) => {
    set({ isLogin });
  },
  setNickname: (nickname: string) => {
    set({ nickname });
  },
  setEmail: (email: string) => {
    set({ email });
  },
  reset: () => set({ isLogin: false, nickname: '', email: '' }),
}));

export default useUserStore;
