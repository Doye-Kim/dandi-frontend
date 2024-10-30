import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDetermineMovement } from '@/hooks/useDetermineMovement';
import { CurrentPin } from '@/assets/icons';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '@/utils';

export type locationType = {
  latitude: number;
  longitude: number;
};

const MapMainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<locationType>(); // 사용자의 현재 위치
  const [locations, setLocations] = useState<locationType[]>([]); // 사용자의 이동 여부를 확인하기 위한 10분 간의 위치 데이터
  const [isMoving, setIsMoving] = useState<boolean>(false); // 사용자 이동 여부
  const [movementId, setMovementId] = useState<number | null>(null); // 동선 ID
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01, // 초기 줌 레벨
    longitudeDelta: 0.01,
  });
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setRegion({
            ...region,
            latitude,
            longitude,
          });
        },
        error => console.log(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  useLocationTracking(setLocations, setCurrentLocation);
  useDetermineMovement(locations, isMoving, setIsMoving);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      // 사용자가 설정한 줌 레벨 유지하면서 중심 좌표만 업데이트
      mapRef.current.animateToRegion(
        {
          ...region,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        1000,
      );
    }
  }, [currentLocation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        style={{ flex: 1 }}>
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}>
            <View style={{ padding: 0 }}>
              <CurrentPin width={50} height={50} />
            </View>
          </Marker>
        )}
      </MapView>
    </SafeAreaView>
  );
};

export default MapMainScreen;
