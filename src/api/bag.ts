import axiosInstance from './axios';

export interface RequestItemProps {
  name: string;
  emoticon: string;
  colorKey: number;
}

export interface RequestBagItemProps extends RequestItemProps {
  bagId: number;
}

export interface BagProps {
  id: number;
  bagOrder: number;
  name: string;
}

export interface ItemProps {
  itemId: number;
  itemOrder: number;
  name: string;
  emoticon: string;
  colorKey: number;
}

export interface RequestBagOrderProps {
  bagId: number;
  order: number;
}

export interface RequestItemOrderProps {
  itemId: number;
  orderId: number;
}

const getBags = async (): Promise<BagProps[]> => {
  const { data } = await axiosInstance.get('/bags');
  return data;
};

const getBagItems = async (bagId: number): Promise<ItemProps[]> => {
  const { data } = await axiosInstance.get(`/bags/${bagId}`);
  return data;
};

const getDrawerItems = async (bagId: number): Promise<ItemProps[]> => {
  const { data } = await axiosInstance.get(`/items/bags/${bagId}`);
  return data;
};

const postCopyNewBag = async (bagId: number, newBagName: string) => {
  const { data } = await axiosInstance.post(`/bags/${bagId}`, { newBagName });
  return data;
};

const postNewBag = async (name: string) => {
  const { data } = await axiosInstance.post(`/bags`, { name });
  return data;
};

const postItems = async (bagId: number, itemIds: number[]) => {
  const { data } = await axiosInstance.post(`/bags/${bagId}/items`, itemIds);
  return data;
};

const deleteBagItem = async (bagId: number, itemId: number) => {
  const { data } = await axiosInstance.delete(`/bags/${bagId}/items/${itemId}`);
  return data;
};

const postItem = async (item: RequestBagItemProps) => {
  const { data } = await axiosInstance.post(`/items`, item);
  return data;
};

const patchBag = async (bagId: number) => {
  const { data } = await axiosInstance.patch(`/bags/${bagId}`);
  return data;
};

const putBagOrder = async (bags: RequestBagOrderProps[]) => {
  const { data } = await axiosInstance.put(`/bags`, bags);
  return data;
};

const putItemOrder = async (items: RequestItemOrderProps[], bagId: number) => {
  const { data } = await axiosInstance.put(`/bags/${bagId}/items`, items);
  return data;
};

const putDrawerOrder = async (items: RequestItemOrderProps[]) => {
  const { data } = await axiosInstance.put(`/items`, items);
  return data;
};

const putEditItem = async (itemId: number, item: RequestItemProps) => {
  const { data } = await axiosInstance.put(`/items/${itemId}`, item);
  return data;
};

const putBagName = async (bagId: number, name: string) => {
  const { data } = await axiosInstance.put(`/bags/${bagId}`, { name });
  return data;
};

const deleteBag = async (bagId: number) => {
  const { data } = await axiosInstance.delete(`/bags/${bagId}`);
  return data;
};

const deleteItem = async (itemId: number) => {
  const { data } = await axiosInstance.delete(`/items/${itemId}`);
  return data;
};

const deleteItems = async (bagId: number, itemIds: number[]) => {
  const { data } = await axiosInstance.delete(`/bags/${bagId}/items`, {
    data: itemIds,
  });
  return data;
};

export {
  getBags,
  getBagItems,
  getDrawerItems,
  postCopyNewBag,
  postNewBag,
  postItems,
  deleteBagItem,
  postItem,
  patchBag,
  putBagOrder,
  putItemOrder,
  putDrawerOrder,
  putEditItem,
  putBagName,
  deleteBag,
  deleteItem,
  deleteItems,
};
