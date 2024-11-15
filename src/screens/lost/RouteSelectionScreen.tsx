import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { isAxiosError } from 'axios';
import { colors } from '@/constants';
import { RouteProp } from '@react-navigation/native';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerSOS } from '@/api/lost';
import { LatLon, getRoutes } from '@/api/map';
import { convertDateFormat } from '@/utils/date';
import { showCustomErrorToast, showToast } from '@/utils/toast';
import { responsive, responsiveVertical } from '@/utils';
import { ResponseRouteListItem } from '@/api/map';
import CustomButton from '@/components/common/CustomButton';
import RouteListItem from '@/components/lost/RouteListItem';
import LostRouteMap from '@/components/lost/LostRouteMap';
import CustomText from '@/components/common/CustomText';

type RouteSelectionScreenRouteProp = RouteProp<
  LostStackParamList,
  'RouteSelection'
>;

type RouteSelectionScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'RouteSelection'
>;

type RouteSelectionScreenProps = {
  route: RouteSelectionScreenRouteProp;
  navigation: RouteSelectionScreenNavigationProp;
};

const RouteSelectionScreen = ({
  route,
  navigation,
}: RouteSelectionScreenProps) => {
  const { photoUrl, explain, location, datetime } = route.params;
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [startRoute, setStartRoute] = useState<number | null>(null);
  const [endRoute, setEndRoute] = useState<number | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);
  const [routes, setRoutes] = useState<ResponseRouteListItem[] | null>(null);
  const [displayedRoute, setDisplayedRoute] = useState<LatLon[] | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getRoutes(convertDateFormat(new Date(datetime)));
        if (data.routes && data.routes.length > 0) {
          setRoutes(data.routes);
          console.log(data.routes);
          setDisplayedRoute(data.routes[0].track);
        } else {
          showCustomErrorToast('분실 날짜에 이동한 경로가 없습니다.');
          setTimeout(() => navigation.navigate('SOSRegister'), 1000);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoutes();
  }, []);

  // SOS 등록
  const handleRegisterSOS = async () => {
    if (startRoute !== null && endRoute !== null) {
      try {
        const data = await registerSOS({
          situationDesc: location,
          itemDesc: explain,
          lostAt: datetime,
          startRoute: startRoute,
          endRoute: endRoute,
          images: [photoUrl],
        });
        console.log(data);
        navigation.navigate('SOSList');
        showToast('SOS 등록이 완료되었습니다.');
      } catch (error) {
        if (isAxiosError(error) && error.response?.data.code === 'E302') {
          showCustomErrorToast('SOS 등록은 하루에 한 번만 가능합니다.');
          navigation.navigate('SOSList');
        }
      }
    } else {
      showToast('경로를 선택해주세요.');
      return;
    }
  };
  // 경로 선택 모드
  const handleLongPress = () => {
    setSelectMode(!selectMode);
    setSelectedRoutes([]);
    setStartRoute(null);
    setEndRoute(null);
  };
  // 전체 선택
  const handleSelectAll = () => {
    if (routes && routes.length > 0 && selectMode) {
      const allRouteIds = routes.map((route) => route.id);
      setSelectedRoutes(allRouteIds);
      setStartRoute(allRouteIds[0]);
      setEndRoute(allRouteIds[allRouteIds.length - 1]);
    }
  };
  // 경로 선택
  const handlePress = (routeId: number) => {
    if (selectMode) {
      if (startRoute === null) {
        setStartRoute(routeId);
        setSelectedRoutes([routeId]);
      } else if (endRoute === null) {
        setEndRoute(routeId);
        const startIndex = routes!.findIndex(
          (route) => route.id === startRoute,
        );
        const endIndex = routes!.findIndex((route) => route.id === routeId);
        const [start, end] = [
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex),
        ];
        const selectedIds = routes!
          .slice(start, end + 1)
          .map((route) => route.id);
        setSelectedRoutes(selectedIds);
      } else {
        setStartRoute(routeId);
        setEndRoute(null);
        setSelectedRoutes([routeId]);
      }
    }
    // 경로 선택 시 지도에 표시
    const selectedRouteData = routes?.find((route) => route.id === routeId);
    if (selectedRouteData) {
      setDisplayedRoute(selectedRouteData.track);
    }
  };

  return (
    <Container>
      <MapBox>
        <LostRouteMap routeData={displayedRoute} />
      </MapBox>
      <SelectHeader>
        <AllButton visible={selectMode} onPress={handleSelectAll}>
          <SelectText>전체 선택</SelectText>
        </AllButton>
        <SelectedButton onPress={handleLongPress}>
          <SelectText>경로 선택</SelectText>
        </SelectedButton>
      </SelectHeader>
      <ListContainer>
        <FlatList
          data={routes}
          renderItem={({ item }) => (
            <RouteListItem
              isSelectMode={selectMode}
              isSelected={selectedRoutes.includes(item.id)}
              route={item}
              handlePress={() => handlePress(item.id)}
              handleLongPress={handleLongPress}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </ListContainer>
      <RegisterButton>
        <CustomButton
          title='등록'
          style='enable'
          height={responsiveVertical(40)}
          onPress={handleRegisterSOS}
        />
      </RegisterButton>
    </Container>
  );
};

export default RouteSelectionScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const MapBox = styled.View`
  width: 100%;
  height: 40%;
  overflow: hidden;
`;

const SelectText = styled(CustomText)``;

const SelectedButton = styled.TouchableOpacity`
  align-self: flex-end;
`;

const RegisterButton = styled.View`
  bottom: 0;
  padding: ${responsive(10)}px 0;
  align-items: center;
  background-color: ${colors.WHITE};
`;

const SelectHeader = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: ${responsive(12)}px;
`;

const ListContainer = styled.View`
  flex: 1;
`;

const AllButton = styled.TouchableOpacity<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;
