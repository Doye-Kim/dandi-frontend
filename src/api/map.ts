import axiosInstance from './axios';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface ResponseRouteListItem {
  id: number;
  track: LatLon[];
  createdAt: string;
  endedAt: string;
}

export interface UseRouteListItem {
  id: number;
  track: LatLng[];
  createdAt: string;
  endedAt: string;
}

export interface ResponseRouteList {
  routes: ResponseRouteListItem[];
  nextRouteId: number;
}

const startRoute = async (bagId: number) => {
  const data = await axiosInstance.post('/routes', { bagId });
  return data;
};

const endRoute = async (routeId: number, track: LatLon[]) => {
  const data = await axiosInstance.patch(`/routes/${routeId}`, { track });
  return data;
};

const getRoutes = async (date: String) => {
  const data = await axiosInstance.get(`/routes?date=${date}`);
  return data;
};

const getRoute = async (routeId: number) => {
  const data = await axiosInstance.get(`routes/${routeId}`);
  return data;
};

// export type skipState = 'Y' | 'N';

export type ResponseRouteItem = {
  id: number;
  memberId: number;
  track: LatLon[];
  skip: string;
  startSnapshot: Snapshot;
  createdAt: string;
  endedAt: string;
};

export type UseRouteItem = {
  id: number;
  memberId: number;
  track: LatLng[];
  skip: string;
  startSnapshot: Snapshot;
  createdAt: string;
  endedAt: string;
};

export interface Item {
  name: string;
  emoticon: string;
  type: number;
  isChecked: boolean;
}

export interface Snapshot {
  bagId: number;
  items: Item[];
}

export interface ResponseSnapshot {
  skip: string;
  snapshot: Snapshot;
}

export { startRoute, endRoute, getRoutes, getRoute };
