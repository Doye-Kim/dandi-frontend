import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateAverageSpeed, calculateDistance } from '@/utils';
import { NativeModules } from 'react-native';
import { LatLng, LatLon } from '@/api/map';
import {
  useEndRouteMutation,
  useStartRouteMutation,
} from '@/queries/mapQueries';
import useBagStore from '@/store/useBagStore';

const { LocationServiceModule } = NativeModules;

const updateMovingState = (isMoving: boolean) => {
  LocationServiceModule.setMovingState(isMoving);
};
// MAX_LOCATIONS_LENGTH
//    사용자의 이동 여부를 확인하기 위한 위치 데이터 최대 개수
//    현재 10초에 한 번 수집, 10분 간의 데이터로 이동 여부 확인을 하기 때문에 60으로 설정해둠
//    distances의 최대 개수도 이와 같음
export const useDetermineMovement = (
  locations: LatLon[],
  isMoving: boolean,
  setIsMoving: (isMoving: boolean) => void,
) => {
  const distances = useRef<number[]>([]);
  const speedThreshold = 0.5;
  const MAX_LOCATIONS_LENGTH = 60;
  const isMovingRef = useRef(isMoving);
  const defaultBagId = useBagStore((state) => state.defaultBagId);

  useEffect(() => {
    isMovingRef.current = isMoving;
  }, [isMoving]);

  const determineMovement = async () => {
    const averageSpeed = calculateAverageSpeed(distances.current);
    const newIsMoving = averageSpeed > speedThreshold;
    // console.log('determine', averageSpeed, isMovingRef.current, newIsMoving);

    if (newIsMoving && !isMovingRef.current) {
      await startMovement();
      console.log('move');
      updateMovingState(true);
    } else if (!newIsMoving && isMovingRef.current) {
      await stopMovement();
      console.log('stop');
      updateMovingState(false);
    }

    setIsMoving(newIsMoving);
    isMovingRef.current = newIsMoving; // 최신 값을 Ref에 업데이트

    if (newIsMoving) {
      const storedLocations = await AsyncStorage.getItem('locations');
      const parsedLocations = storedLocations
        ? JSON.parse(storedLocations)
        : [];

      await AsyncStorage.setItem(
        'locations',
        JSON.stringify([...parsedLocations, locations.at(-1)]),
      );
    }
  };

  const startMutation = useStartRouteMutation();
  const startMovement = async () => {
    const newRouteId = 1;
    await AsyncStorage.setItem('routeId', String(newRouteId));
    await AsyncStorage.setItem(
      'locations',
      JSON.stringify(locations.slice(-10)),
    );
    startMutation.mutate(defaultBagId);
  };

  const endMutation = useEndRouteMutation();
  const stopMovement = async () => {
    setIsMoving(false);
    const routeId = Number(await AsyncStorage.getItem('routeId'));
    const trackString = await AsyncStorage.getItem('locations');
    const track = trackString ? (JSON.parse(trackString) as LatLon[]) : [];

    console.log({ routeId }, { track });
    endMutation.mutate({ routeId, track });
    await AsyncStorage.removeItem('routeId');
    await AsyncStorage.removeItem('locations');
  };

  useEffect(() => {
    // console.log(locations.at(-1));
    if (locations.length >= 2) {
      const [lastLocation, prevLocation] = [locations.at(-1), locations.at(-2)];
      const dist = calculateDistance(
        lastLocation?.lat,
        lastLocation?.lon,
        prevLocation?.lat,
        prevLocation?.lon,
      );
      if (dist >= 0) distances.current.push(dist);
      if (distances.current.length > MAX_LOCATIONS_LENGTH)
        distances.current.shift();
    }

    if (locations.length >= 10) {
      determineMovement();
    }
  }, [locations]);
};
