import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
  Region,
} from 'react-native-maps';

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDetermineMovement } from '@/hooks/useDetermineMovement';
import { CurrentPin, MarkerIcon, SparkleIcon } from '@/assets/icons';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '@/utils';
import { colors } from '@/constants';
import CustomHeader from '@/components/map/CustomHeader';
import { LatLng, LatLon, UseRouteListItem } from '@/api/map';
import { routes } from '@/dummy/dailyRoute.json';
import CustomText from '@/components/common/CustomText';
import styled from 'styled-components/native';

const MapMainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<LatLng>(); // 사용자의 현재 위치
  const [locations, setLocations] = useState<LatLon[]>([]); // 사용자의 이동 여부를 확인하기 위한 10분 간의 위치 데이터
  const [isMoving, setIsMoving] = useState<boolean>(false); // 사용자 이동 여부
  const [movementId, setMovementId] = useState<number | null>(null); // 동선 ID
  const [snapshotId, setSnapshotId] = useState<number>();
  const [isOpenChecklist, setIsOpenChecklist] = useState<boolean>(false);
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
          console.log({ latitude, longitude });
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

  // 현재 위치 갱신 및 동선 수집
  useLocationTracking(setLocations, setCurrentLocation);
  useDetermineMovement(locations, isMoving, setIsMoving);

  // 현재 위치 초기값 설정
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

  const [data, setData] = useState<UseRouteListItem[] | undefined>();

  useEffect(() => {
    const convertedData = routes.map(route => ({
      ...route,
      track: route.track.map(point => ({
        latitude: point.lat,
        longitude: point.lon,
      })),
    })) as UseRouteListItem[];
    setData(convertedData);
  }, [routes]);

  const onPressPolyline = () => {
    console.log('polyline');
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader />
      <ToggleButton>
        <SparkleIcon />
        <CustomText style={{ marginLeft: 10, color: colors.WHITE }}>
          동선 상세 보기
        </CustomText>
      </ToggleButton>
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
            zIndex={10}
            anchor={{ x: 0.5, y: 0.5 }}>
            <CurrentPin width={60} height={60} />
          </Marker>
        )}

        {data &&
          data.map((route, index) => (
            <React.Fragment key={route.routeId || index}>
              <Polyline
                coordinates={route.track}
                strokeWidth={10}
                strokeColor={colors.GRAY_800}
                tappable={true}
                onPress={onPressPolyline}
              />
              <Polyline
                coordinates={route.track}
                strokeWidth={8}
                strokeColor={colors.WHITE}
                tappable={true}
                onPress={onPressPolyline}
              />
              <Polyline
                coordinates={route.track}
                strokeWidth={5}
                strokeColor={colors.PRIMARY}
                tappable={true}
                onPress={onPressPolyline}
              />
              <Marker
                coordinate={{
                  latitude: route.track[0].latitude,
                  longitude: route.track[0].longitude,
                }}
                anchor={{ x: 0.5, y: 1 }}>
                <MarkerIcon width={30} height={30} />
              </Marker>
              <Marker
                coordinate={{
                  latitude: route.track[route.track.length - 1].latitude,
                  longitude: route.track[route.track.length - 1].longitude,
                }}
                anchor={{ x: 0.5, y: 1 }}>
                <MarkerIcon width={30} height={30} />
              </Marker>
            </React.Fragment>
          ))}
      </MapView>
    </SafeAreaView>
  );
};

export default MapMainScreen;

const ToggleButton = styled.TouchableOpacity`
  padding-vertical: 5px;
  padding-horizontal: 10px;
  position: absolute;
  top: 70px;
  right: 0px;
  z-index: 10;
  margin: 5px;
  background-color: ${colors.PRIMARY};
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
