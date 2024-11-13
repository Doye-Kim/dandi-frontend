import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  endRoute,
  getRoute,
  getRouteId,
  getRoutes,
  LatLng,
  LatLon,
  startRoute,
} from '@/api/map';
import { checkErrorAndViewToast } from '@/utils';

export const useRoutesQuery = (date: string) => {
  return useQuery({
    queryKey: ['routes', date],
    queryFn: () => getRoutes(date),
    select: (data) => ({
      ...data,
      routes: data.routes.map((route) => ({
        ...route,
        track: route.track.map((point) => ({
          latitude: point.lat,
          longitude: point.lon,
        })) as LatLng[],
      })),
    }),
  });
};

export const useRouteQuery = (
  routeId: number | undefined,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ['route', routeId],
    queryFn: () => getRoute(routeId as number),
    enabled,
    select: (data) => ({
      ...data,
      track: data.track.map((point) => ({
        latitude: point.lat,
        longitude: point.lon,
      })) as LatLng[],
    }),
  });
};

export const useRouteIdQuery = () => {
  return useQuery({
    queryKey: ['routeId'],
    queryFn: () => getRouteId(),
    select: (data) => data.routeId,
  });
};

export const useStartRouteMutation = () => {
  return useMutation({
    mutationFn: (bagId: number) => startRoute(bagId),

    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};

export const useEndRouteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, track }: { routeId: number; track: LatLon[] }) =>
      endRoute(routeId, track),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['routes', 'routeId', 'route'],
      });
    },

    onError: (error) => {
      checkErrorAndViewToast(error);
    },
  });
};
