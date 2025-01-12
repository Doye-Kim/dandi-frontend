import {
  deleteBag,
  deleteBagItem,
  deleteItem,
  deleteItems,
  getBagItems,
  getBags,
  getDrawerItems,
  ItemProps,
  patchBag,
  postCopyNewBag,
  postItem,
  postItems,
  postNewBag,
  putBagName,
  putBagOrder,
  putDrawerOrder,
  putEditItem,
  putItemOrder,
  RequestBagItemProps,
  RequestBagOrderProps,
  RequestItemOrderProps,
  RequestItemProps,
} from '@/api/bag';
import { checkErrorAndViewToast } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
      checkErrorAndViewToast(error);
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
      checkErrorAndViewToast(error);
    },
  });
};

export const useDrawerItemOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestItems: RequestItemOrderProps[]) =>
      putDrawerOrder(requestItems),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawerItems'] });
    },

    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};

export const useBagItemOrderMutation = () => {
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
      checkErrorAndViewToast(error);
    },
  });
};

export const useBagOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bags: RequestBagOrderProps[]) => putBagOrder(bags),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
    },

    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};

export const useCopyToDefaultMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bagId: number) => patchBag(bagId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },

    onError: (error) => {
      checkErrorAndViewToast(error);
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
      checkErrorAndViewToast(error);
    },
  });
};

export const useCreateBagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => postNewBag(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
    },
    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};

export const useCreateCopyBagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bagId, name }: { bagId: number; name: string }) =>
      postCopyNewBag(bagId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
    },
    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};

export const useEditBagNameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bagId, name }: { bagId: number; name: string }) =>
      putBagName(bagId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
    },
    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};

export const useDeleteBagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bagId: number) => deleteBag(bagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bags'] });
    },
    onError: (error) => {
      checkErrorAndViewToast(error);
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
      checkErrorAndViewToast(error);
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
      checkErrorAndViewToast(error);
    },
  });
};

export const useDeleteItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bagId, itemsId }: { bagId: number; itemsId: number[] }) =>
      deleteItems(bagId, itemsId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drawerItems'] });
      queryClient.invalidateQueries({ queryKey: ['bagItems'] });
    },
    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};
