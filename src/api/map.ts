import axiosInstance from './axios';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type LatLon = {
  lat: number;
  lon: number;
};

export type ResponseRouteListItem = {
  routeId: number; // 이동 ID
  skip: 'Y' | 'N';
  snapshotId: number; // 스냅샷 ID
  track: LatLon[];
  createdAt: string; // 이동 시작 시간
  endedAt: string; // 이동 종료 시간
};

export type UseRouteListItem = {
  routeId: number; // 이동 ID
  skip: 'Y' | 'N';
  snapshotId: number; // 스냅샷 ID
  track: LatLng[];
  createdAt: string; // 이동 시작 시간
  endedAt: string; // 이동 종료 시간
};

const startRoute = async ({ bagId }: { bagId: number }) => {
  const data = await axiosInstance.post('/routes', { bagId });
  return data;
};

const endRoute = async ({
  routeId,
  track,
}: {
  routeId: number;
  track: LatLon[];
}) => {
  const data = await axiosInstance.patch(`/routes/${routeId}`, { track });
  return data;
};

export { startRoute, endRoute };
