import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import styled from 'styled-components/native';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDetermineMovement } from '@/hooks/useDetermineMovement';
import { CurrentPin, SparkleIcon } from '@/assets/icons';
import { getCurrentLocation } from '@/utils';
import { colors } from '@/constants';
import CustomHeader from '@/components/map/CustomHeader';
import {
  LatLng,
  LatLon,
  ResponseRouteItem,
  ResponseRouteListItem,
  UseRouteItem,
  UseRouteListItem,
} from '@/api/map';
import CustomText from '@/components/common/CustomText';
import CheckListModal from '@/components/map/ChecklistModal';
import CustomPolyline from '@/components/map/CustomPolyLine';
import CustomMarker from '@/components/map/CustomMarker';
import { routes } from '@/dummy/routes.json';
import { nextRouteId } from '@/dummy/routes.json';
import route from '@/dummy/route.json';

const MapMainScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<LatLng>(); // 사용자의 현재 위치
  const [locations, setLocations] = useState<LatLon[]>([]); // 사용자의 이동 여부를 확인하기 위한 10분 간의 위치 데이터
  const [isMoving, setIsMoving] = useState<boolean>(false); // 사용자 이동 여부
  const [routeId, setRouteId] = useState<number | null>(null); // 동선 ID
  const [isOpenChecklist, setIsOpenChecklist] = useState<boolean>(false);
  const [isMain, setIsMain] = useState<boolean>(true);
  const today = new Date();
  const [date, setDate] = useState(today);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>();

  // 현재 위치 초기값 설정
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // 초기 줌 레벨
          longitudeDelta: 0.01,
        });
      }
    };

    fetchLocation();
  }, []);

  // 현재 위치 갱신 및 동선 수집
  useLocationTracking(setLocations, setCurrentLocation);
  useDetermineMovement(locations, isMoving, setIsMoving);

  // 동선 데이터 처리
  const [data, setData] = useState<
    UseRouteListItem[] | UseRouteItem | undefined | null
  >();

  const convertRouteArray = (
    input: ResponseRouteListItem[],
  ): UseRouteListItem[] => {
    return input.map((route) => ({
      ...route,
      track: route.track.map((point) => ({
        latitude: point.lat,
        longitude: point.lon,
      })),
    }));
  };

  const convertRouteObject = (input: ResponseRouteItem): UseRouteItem => {
    return {
      ...input,
      track: input.track.map((point) => ({
        latitude: point.lat,
        longitude: point.lon,
      })),
    };
  };

  // #todo: 동선이 없으면 현재 위치를 중심으로 함
  useEffect(() => {
    let convertedData;
    if (isMain) convertedData = convertRouteArray(routes) as UseRouteListItem[];
    else
      convertedData = convertedData = convertRouteObject(route) as UseRouteItem;

    const allCoordinates = Array.isArray(convertedData)
      ? convertedData.flatMap((route) => route.track)
      : convertedData.track;

    setData(convertedData);

    // 모든 좌표를 맵 중심으로 맞춤
    mapRef.current?.fitToCoordinates(allCoordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // 원하는 여백 추가
      animated: true,
    });
  }, [isMain]);

  // 상호작용
  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const onPressToggle = () => {
    if (Array.isArray(data)) setRouteId(data[data.length - 1].id);
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
      {isMain ? (
        <CustomHeader
          isMain={isMain}
          today={today}
          date={date}
          setDate={setDate}
        />
      ) : (
        !Array.isArray(data) &&
        data && (
          <CustomHeader
            isMain={isMain}
            today={today}
            data={data}
            setData={setData}
          />
        )
      )}
      <ToggleButton onPress={onPressToggle}>
        <SparkleIcon />
        <CustomText style={{ marginLeft: 10, color: colors.WHITE }}>
          {isMain ? '동선 상세 보기' : '동선 모아 보기'}
        </CustomText>
      </ToggleButton>
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

        {data &&
          (Array.isArray(data) ? data : [data]).map((route, index) => (
            <React.Fragment key={route.id || index}>
              <CustomPolyline
                track={route.track}
                id={route.id}
                onPress={onPressPolyline}
              />
              {Array.isArray(data) && index === data.length - 1 ? (
                <CustomMarker
                  track={route.track}
                  isRoute={false}
                  routeId={route.id}
                  isLast={true}
                  nextId={nextRouteId}
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
      {routeId &&
        data &&
        (Array.isArray(data) ? (
          <CheckListModal
            visible={isOpenChecklist}
            onDismiss={() => setIsOpenChecklist(false)}
            routeId={routeId}
          />
        ) : (
          <CheckListModal
            visible={isOpenChecklist}
            onDismiss={() => setIsOpenChecklist(false)}
            routeId={routeId}
            snapshot={data.startSnapshot}
            skip={data.skip}
          />
        ))}
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
