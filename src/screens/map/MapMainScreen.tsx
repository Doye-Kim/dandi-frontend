import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import styled from 'styled-components/native';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDetermineMovement } from '@/hooks/useDetermineMovement';
import { CurrentPin, SparkleIcon } from '@/assets/icons';
import {
  checkErrorAndViewToast,
  convertDateFormat,
  getCurrentLocation,
} from '@/utils';
import { LatLng, LatLon, UseRouteProps, getRoute, getRouteId } from '@/api/map';
import { useRoutesQuery } from '@/queries/mapQueries';
import { colors } from '@/constants';
import CheckListModal from '@/components/map/ChecklistModal';
import CustomPolyline from '@/components/map/CustomPolyLine';
import CustomHeader from '@/components/map/CustomHeader';
import CustomMarker from '@/components/map/CustomMarker';
import CustomText from '@/components/common/CustomText';

const MapMainScreen = () => {
  const today = new Date();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [locations, setLocations] = useState<LatLon[]>([]); // 사용자의 이동 여부를 확인하기 위한 10분 간의 위치 데이터
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [defaultId, setDefaultId] = useState<number>();
  const [routeId, setRouteId] = useState<number | undefined>();
  const [date, setDate] = useState(today);
  const [isOpenChecklist, setIsOpenChecklist] = useState<boolean>(false);
  const [isMain, setIsMain] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>();

  const [route, setRoute] = useState<UseRouteProps>();
  const { data: routes, error } = useRoutesQuery(convertDateFormat(date));

  const getCurrentRouteId = async () => {
    try {
      const { routeId } = await getRouteId();
      setRouteId(routeId);
      setDefaultId(routeId);
      getCurrentRoute(routeId);
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  const getCurrentRoute = async (routeId: number) => {
    try {
      const routeData = await getRoute(routeId);
      setRoute({
        ...routeData,
        track: routeData.track.map((point) => ({
          latitude: point.lat,
          longitude: point.lon,
        })) as LatLng[],
      });
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  useEffect(() => {
    getCurrentRouteId();
  }, []);

  useEffect(() => {
    if (routeId) getCurrentRoute(routeId);
  }, [routeId]);

  useEffect(() => {
    if (routes) {
      // console.warn('map main routes', JSON.stringify(routes));
    }
    if (error) {
      checkErrorAndViewToast(error);
    }
  }, [routes, error]);

  // 현재 위치 초기값 설정
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        mapRef.current?.fitToCoordinates(
          [
            {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          ],
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          },
        );
      }
    };
    fetchLocation();
  }, []);

  // 현재 위치 갱신 및 동선 수집
  useLocationTracking(setLocations, setCurrentLocation);
  useDetermineMovement(locations, isMoving, setIsMoving);

  // 맵 중심 맞추기
  const updateMapCenter = () => {
    const allCoordinates = isMain
      ? routes?.routes.flatMap((route) => route.track)
      : route && route.track;

    // 모든 좌표를 맵 중심으로 맞춤
    if (allCoordinates && allCoordinates.length > 0) {
      mapRef.current?.fitToCoordinates(allCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };
  useEffect(() => {
    updateMapCenter();
  }, [isMain]);

  // 상호작용(줌, 이동 등등..)
  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  // #todo? 버튼 누르면 현재 위치를 지도의 중심으로 하는 것도 있으면 좋겠다

  const onPressToggle = () => {
    if (isMain) {
      setRouteId(defaultId);
    }
    setIsMain((prev) => !prev);
  };

  const onPressMarker = (id: number) => {
    setIsOpenChecklist(true);
    setRouteId(id);
  };

  const onPressPolyline = (id: number) => {
    setIsMain(false);
    setRouteId(id);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isMain && routes ? (
        <CustomHeader
          isMain={isMain}
          today={today}
          date={date}
          setDate={setDate}
        />
      ) : (
        !isMain &&
        route && (
          <CustomHeader
            isMain={isMain}
            today={today}
            route={route}
            setRouteId={setRouteId}
          />
        )
      )}
      {routeId && (
        <ToggleButton onPress={onPressToggle}>
          <SparkleIcon />
          <CustomText style={{ marginLeft: 10, color: colors.WHITE }}>
            {isMain ? '동선 상세 보기' : '동선 모아 보기'}
          </CustomText>
        </ToggleButton>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
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

        {routes?.routes &&
          route &&
          (isMain ? routes.routes : route && [route]).map((route, index) => (
            <React.Fragment key={route.id || index}>
              <CustomPolyline
                track={route.track}
                id={route.id}
                onPress={onPressPolyline}
              />
              {routes &&
              index === routes?.routes.length - 1 &&
              routes?.nextRouteId ? (
                <CustomMarker
                  track={route.track}
                  isRoute={false}
                  routeId={route.id}
                  isLast={true}
                  nextId={routes?.nextRouteId}
                  onPress={onPressMarker}
                />
              ) : (
                <CustomMarker
                  track={route.track}
                  isRoute={false}
                  routeId={route.id}
                  isLast={false}
                  onPress={onPressMarker}
                />
              )}
            </React.Fragment>
          ))}
      </MapView>
      {isMain && routes ? (
        <CheckListModal
          visible={isOpenChecklist}
          onDismiss={() => setIsOpenChecklist(false)}
          routeId={routeId}
        />
      ) : (
        route && (
          <CheckListModal
            visible={isOpenChecklist}
            onDismiss={() => setIsOpenChecklist(false)}
            routeId={routeId}
            snapshot={route.startSnapshot}
            skip={route.skip}
          />
        )
      )}
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
