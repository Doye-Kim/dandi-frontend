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
  startAddress: string;
  endAddress: string;
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

export interface CheckListItemProps {
  name: string;
  emoticon: string;
  type: number;
  isChecked: boolean;
}

export interface RouteProps {
  id: number;
  memberId: number;
  track: LatLon[];
  skip: string;
  startAddress: string;
  endAddress: string;
  startSnapshot: {
    bagId: number;
    items: CheckListItemProps[];
  };
  nextSnapshot: {
    bagId: number;
    items: CheckListItemProps[];
  };
  previousRouteId: number | null;
  nextRouteId: number | null;
  createdAt: string;
  endedAt: string;
}

export interface UseRouteProps {
  id: number;
  memberId: number;
  track: LatLng[];
  skip: string;
  startAddress: string;
  endAddress: string;
  startSnapshot: {
    bagId: number;
    items: CheckListItemProps[];
  };
  nextSnapshot: {
    bagId: number;
    items: CheckListItemProps[];
  };
  previousRouteId: number | null;
  nextRouteId: number | null;
  createdAt: string;
  endedAt: string;
}

const startRoute = async (bagId: number) => {
  const { data } = await axiosInstance.post('/routes', { bagId });
  return data;
};

const endRoute = async (routeId: number, track: LatLon[]) => {
  const { data } = await axiosInstance.patch(`/routes/${routeId}`, { track });
  return data;
};

const getRouteId = async () => {
  const { data } = await axiosInstance.get('/routes/current');
  return data;
};

const getRoutes = async (date: String): Promise<ResponseRouteList> => {
  const { data } = await axiosInstance.get(`/routes?date=${date}`);
  return data;
};

const getRoute = async (routeId: number): Promise<RouteProps> => {
  const { data } = await axiosInstance.get(`routes/${routeId}`);
  return data;
};

const patchSnapshot = async (routeId: number, snapshot: Snapshot) => {
  const { data } = await axiosInstance.patch(`routes/${routeId}/snapshot`, {
    snapshot,
  });
  return data;
};

const getSnapshot = async (routeId: number) => {
  const { data } = await axiosInstance.get(`routes/${routeId}/snapshot`);
  return data;
};

const getAddress = async (lat: number, lon: number) => {
  const { data } = await axiosInstance.get(`/geo/address`, {
    params: { lat, lon },
  });
  return data;
};
// export type skipState = 'Y' | 'N';

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

export {
  startRoute,
  endRoute,
  getRoutes,
  getRoute,
  getRouteId,
  patchSnapshot,
  getSnapshot,
  getAddress,
};
