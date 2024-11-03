import { create } from 'zustand';

// mode 1 => basic mode
// mode 2 => edit mode
// mode 3 => custom bag mode
interface BagState {
  mode: number;
  setMode: (mode: number) => void;
  reset: () => void;
}
const useBagStore = create<BagState>((set) => ({
  mode: 1,
  setMode: (mode: number) => {
    set({ mode });
  },
  reset: () => set({ mode: 1 }),
}));

export default useBagStore;
