import {
  deleteBagItem,
  deleteItem,
  getBagItems,
  getBags,
  getDrawerItems,
  ItemProps,
  postItem,
  postItems,
  putDrawerOrder,
  putEditItem,
  putItemOrder,
  RequestBagItemProps,
  RequestItemOrderProps,
  RequestItemProps,
} from '@/api/bag';
import { showErrorToast } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useBagQuery = () => {
  return useQuery({
    queryKey: ['bags'],
    queryFn: getBags,
    select: (data) => data.sort((a, b) => a.bagOrder - b.bagOrder),
  });
};

export const useDrawerItemQuery = (
  selectBagId: number,
  defaultBagId: number,
) => {
  return useQuery<ItemProps[]>({
    queryKey: ['drawerItems', selectBagId],
    queryFn: () =>
      getDrawerItems(selectBagId === -1 ? defaultBagId : selectBagId),
    select: (data) => data.sort((a, b) => a.itemOrder - b.itemOrder),
  });
};

export const useBagItemQuery = (selectBagId: number, defaultBagId: number) => {
  return useQuery<ItemProps[], Error>({
    queryKey: ['bagItems', selectBagId],
    queryFn: () => getBagItems(selectBagId === -1 ? defaultBagId : selectBagId),
    select: (data) => data.sort((a, b) => a.itemOrder - b.itemOrder),
  });
};

export const useCreateBagItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestItem: RequestBagItemProps) => postItem(requestItem),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};

export const useEditBagItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      requestItem,
    }: {
      id: number;
      requestItem: RequestItemProps;
    }) => putEditItem(id, requestItem),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};

export const useDrawerOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestItems: RequestItemOrderProps[]) =>
      putDrawerOrder(requestItems),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawerItems'] });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};

export const useBagOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bagId,
      requestItems,
    }: {
      bagId: number;
      requestItems: RequestItemOrderProps[];
    }) => putItemOrder(requestItems, bagId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};

export const useMoveDrawerItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      selectBagId,
      requestItems,
    }: {
      selectBagId: number;
      requestItems: number[];
    }) => postItems(selectBagId, requestItems),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawerItems'] });
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};

export const useBagItemMoveToDrawerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      selectBagId,
      itemId,
    }: {
      selectBagId: number;
      itemId: number;
    }) => deleteBagItem(selectBagId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
      queryClient.invalidateQueries({ queryKey: ['drawerItems'] });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
    },
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawerItems'] });
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
    },
  });
};
