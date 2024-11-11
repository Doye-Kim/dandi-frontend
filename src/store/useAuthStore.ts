import { create } from 'zustand';

interface AuthState {
  nickname: string;
  email: string;
  password: string;
  verificationNumber: string;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setVerificationNumber: (verificationNumber: string) => void;
  setPassword: (password: string) => void;
  resetAuthInfo: () => void;
}
const useAuthStore = create<AuthState>((set) => ({
  nickname: '',
  email: '',
  password: '',
  verificationNumber: '',
  setNickname: (nickname: string) => {
    set({ nickname });
  },
  setEmail: (email: string) => {
    set({ email });
  },
  setPassword: (password: string) => {
    set({ password });
  },
  setVerificationNumber: (verificationNumber: string) => {
    set({ verificationNumber });
  },
  resetAuthInfo: () =>
    set({ nickname: '', email: '', password: '', verificationNumber: '' }),
}));

export default useAuthStore;
