import React from 'react';
import { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import CustomText from '@/components/common/CustomText';
import CustomButton from '@/components/common/CustomButton';
import RouteListItem from '@/components/lost/RouteListItem';
import LostRouteMap from '@/components/lost/LostRouteMap';
import routes from '@/dummy/routes.json';

const RouteSelectionScreen = () => {
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [startRoute, setStartRoute] = useState<string>('');
  const [endRoute, setEndRoute] = useState<string>('');

  const handleLongPress = () => {
    setSelectMode(true);
  };

  return (
    <Container>
      <MapBox>
        <LostRouteMap routeData={routes.routes} />
      </MapBox>
      {/* 전체 선택 버튼 */}
      {selectMode && (
        <AllButtonBox>
          <AllButton>
            <CustomText>전체 선택</CustomText>
          </AllButton>
        </AllButtonBox>
      )}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={() => <RouteListItem handleLongPress={handleLongPress} />}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{ paddingBottom: responsiveVertical(60) }}
      />
      <RegisterButton>
        <CustomButton
          title='등록'
          style='enable'
          height={48}
          onPress={() => console.log('SOS 등록')}
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

const RegisterButton = styled.View`
  position: absolute;
  bottom: ${responsiveVertical(10)}px;
  align-self: center;
`;

const AllButtonBox = styled.View`
  width: 100%;
  padding: ${responsive(8)}px;
`;

const AllButton = styled.TouchableOpacity``;
