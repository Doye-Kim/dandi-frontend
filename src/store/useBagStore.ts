import { ItemKeyProps } from '@/components/bag/main/BagThings';
import { create } from 'zustand';

interface BagState {
  editMode: boolean;
  isEditComplete: boolean;
  selectBagId: number;
  defaultBagId: number;
  setEditMode: (mode: boolean) => void;
  setIsEditComplete: (isEditComplete: boolean) => void;
  setSelectBagId: (selectBagId: number) => void;
  setDefaultBagId: (defaultBagId: number) => void;
  reset: () => void;
}
const useBagStore = create<BagState>((set) => ({
  editMode: false,
  isEditComplete: false,
  selectBagId: -1,
  defaultBagId: -1,
  setEditMode: (editMode: boolean) => {
    set({ editMode });
  },
  setIsEditComplete: (isEditComplete: boolean) => {
    set({ isEditComplete });
  },
  setSelectBagId: (selectBagId: number) => {
    set({ selectBagId });
  },
  setDefaultBagId: (defaultBagId: number) => {
    set({ defaultBagId });
  },
  reset: () => set({ editMode: false, selectBagId: -1, defaultBagId: -1 }),
}));

export default useBagStore;
