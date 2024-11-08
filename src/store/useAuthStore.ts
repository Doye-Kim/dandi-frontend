import { create } from 'zustand';

interface AuthState {
  nickname: string;
  email: string;
  password: string;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  resetAuthInfo: () => void;
}
const useAuthStore = create<AuthState>((set) => ({
  nickname: '',
  email: '',
  password: '',
  setNickname: (nickname: string) => {
    set({ nickname });
  },
  setEmail: (email: string) => {
    set({ email });
  },
  setPassword: (password: string) => {
    set({ password });
  },
  resetAuthInfo: () => set({ nickname: '', email: '', password: '' }),
}));

export default useAuthStore;
