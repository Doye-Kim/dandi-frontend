import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  Text,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CustomText from '@/components/common/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants';
import {
  calculateAverageSpeed,
  calculateDistance,
  requestLocationPermission,
} from '@/utils';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDetermineMovement } from '@/hooks/useDetermineMovement';

const { LocationServiceModule } = NativeModules;
const locationEventEmitter = new NativeEventEmitter(LocationServiceModule);

export type locationType = {
  latitude: number;
  longitude: number;
};

// 사용자의 이동 여부를 확인하기 위한 위치 데이터 최대 개수
// 현재 10초에 한 번 수집, 10분 간의 데이터로 이동 여부 확인을 하기 때문에 60으로 설정해둠
// distances의 최대 개수도 이와 같음
const MAX_LOCATIONS_LENGTH = 60;
const MapMainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<locationType>(); // 사용자의 현재 위치
  const [locations, setLocations] = useState<locationType[]>([]); // 사용자의 이동 여부를 확인하기 위한 10분 간의 위치 데이터
  const [isMoving, setIsMoving] = useState<boolean>(false); // 사용자 이동 여부
  const [movementId, setMovementId] = useState<number | null>(null); // 동선 ID
  const distances = useRef<number[]>([]); // 속도를 계산하기 위한 각 위치 간의 거리
  const speedThreshold = 0.5; // 이동 여부를 판별하기 위한 기준 속도

  useLocationTracking(setLocations, setCurrentLocation);
  useDetermineMovement(locations, isMoving, setIsMoving);

  return (
    <SafeAreaView>
      <CustomText style={{ color: colors.BLACK }}>MapMainScreen</CustomText>
      <Text>Latitude: {currentLocation?.latitude}</Text>
      <Text>Longitude: {currentLocation?.longitude}</Text>
    </SafeAreaView>
  );
};

export default MapMainScreen;