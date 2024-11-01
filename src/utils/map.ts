import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './permission';
import { LatLng } from '@/api/map';

const timeInterval = 10000;

const calculateDistance = (
  lat1: number | undefined,
  lon1: number | undefined,
  lat2: number | undefined,
  lon2: number | undefined,
) => {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined
  )
    return -1;
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3; // 지구의 반지름 (단위: 미터)
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 두 지점 간 거리 (미터)
};

// 평균 속도 계산 함수
const calculateAverageSpeed = (distances: number[]) => {
  const totalDistance = distances.reduce((acc, distance) => acc + distance, 0);
  const averageSpeed =
    totalDistance / (distances.length * (timeInterval / 1000)); // m/s
  return averageSpeed;
};

const getCurrentLocation = async (): Promise<LatLng | null> => {
  const hasPermission = await requestLocationPermission();
  if (hasPermission) {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        error => {
          console.log(error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  } else {
    return null;
  }
};

export { calculateDistance, calculateAverageSpeed, getCurrentLocation };
