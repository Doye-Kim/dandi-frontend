import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateAverageSpeed, calculateDistance } from '@/utils';
import { locationType } from '@/screens/map/MapMainScreen';
import { NativeModules } from 'react-native';

const { LocationServiceModule } = NativeModules;

const updateMovingState = (isMoving: boolean) => {
  LocationServiceModule.setMovingState(isMoving);
};

export const useDetermineMovement = (
  locations: locationType[],
  isMoving: boolean,
  setIsMoving: (isMoving: boolean) => void,
) => {
  const distances = useRef<number[]>([]);
  const speedThreshold = 0.5;
  const MAX_LOCATIONS_LENGTH = 60;
  const isMovingRef = useRef(isMoving); // 최신 isMoving 값을 저장할 Ref

  useEffect(() => {
    isMovingRef.current = isMoving; // isMoving 값이 변경될 때마다 Ref 업데이트
  }, [isMoving]);

  const determineMovement = async () => {
    const averageSpeed = calculateAverageSpeed(distances.current);
    const newIsMoving = averageSpeed > speedThreshold;
    console.log('determine', averageSpeed, isMovingRef.current, newIsMoving);

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

  const startMovement = async () => {
    const newMovementId = 1;
    await AsyncStorage.setItem('movementId', String(newMovementId));
    await AsyncStorage.setItem(
      'locations',
      JSON.stringify(locations.slice(-10)),
    );
  };

  const stopMovement = async () => {
    setIsMoving(false);
    await AsyncStorage.removeItem('movementId');
    await AsyncStorage.removeItem('locations');
  };

  useEffect(() => {
    if (locations.length >= 2) {
      const [lastLocation, prevLocation] = [locations.at(-1), locations.at(-2)];
      const dist = calculateDistance(
        lastLocation?.latitude,
        lastLocation?.longitude,
        prevLocation?.latitude,
        prevLocation?.longitude,
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