import { ItemKeyProps } from '@/components/bag/main/BagThings';
import { create } from 'zustand';

interface BagState {
  editMode: boolean;
  selectBagId: number;
  defaultBagId: number;
  bagItems: ItemKeyProps[];
  setEditMode: (mode: boolean) => void;
  setSelectBagId: (selectBagId: number) => void;
  setDefaultBagId: (defaultBagId: number) => void;
  setBagItems: (bagItems: ItemKeyProps[]) => void;
  addMultipleItems: (newItems: ItemKeyProps[]) => void;
  updateDisabledDrag: (disabled: boolean) => void;
  removeItemById: (itemId: number) => void;
  reset: () => void;
}
const useBagStore = create<BagState>((set) => ({
  editMode: false,
  selectBagId: -1,
  defaultBagId: -1,
  bagItems: [],
  setEditMode: (editMode: boolean) => {
    set({ editMode });
  },
  setSelectBagId: (selectBagId: number) => {
    set({ selectBagId });
  },
  setDefaultBagId: (defaultBagId: number) => {
    set({ defaultBagId });
  },
  setBagItems: (bagItems: ItemKeyProps[]) => {
    set({ bagItems });
  },
  addMultipleItems: (newItems: ItemKeyProps[]) =>
    set((state) => {
      const currentLength = state.bagItems.length;
      const updatedNewItems = newItems.map((item, index) => ({
        ...item,
        itemOrder: currentLength + index + 1, // 기존 길이 + 1부터 시작하여 차례대로 설정
      }));
      console.log(updatedNewItems);
      return {
        bagItems: [...state.bagItems, ...updatedNewItems],
      };
    }),
  updateDisabledDrag: (disabled: boolean) =>
    set((state) => ({
      bagItems: state.bagItems.map((item) => ({
        ...item,
        disabledDrag: disabled,
      })),
    })),
  removeItemById: (itemId: number) => {
    set((state) => ({
      bagItems: state.bagItems.filter((item) => item.itemId !== itemId),
    }));
  },
  reset: () =>
    set({ editMode: false, selectBagId: -1, defaultBagId: -1, bagItems: [] }),
}));

export default useBagStore;
