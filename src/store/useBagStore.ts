import { create } from 'zustand';

interface BagState {
  editMode: boolean;
  selectBagId: number;
  defaultBagId: number;
  setEditMode: (mode: boolean) => void;
  setSelectBagId: (selectBagId: number) => void;
  setDefaultBagId: (defaultBagId: number) => void;
  reset: () => void;
}
const useBagStore = create<BagState>((set) => ({
  editMode: false,
  selectBagId: 0,
  defaultBagId: 0,
  setEditMode: (editMode: boolean) => {
    set({ editMode });
  },
  setSelectBagId: (selectBagId: number) => {
    set({ selectBagId });
  },
  setDefaultBagId: (defaultBagId: number) => {
    set({ defaultBagId });
  },
  reset: () => set({ editMode: false, selectBagId: 0, defaultBagId: 0 }),
}));

export default useBagStore;
