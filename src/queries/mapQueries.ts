import { endRoute, LatLon, startRoute } from '@/api/map';
import { showErrorToast } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useStartRouteMutation = () => {
  return useMutation({
    mutationFn: (bagId: number) => startRoute(bagId),

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};

export const useEndRouteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, track }: { routeId: number; track: LatLon[] }) =>
      endRoute(routeId, track),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    },
  });
};
