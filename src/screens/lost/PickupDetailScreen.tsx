import React from 'react';
import { useEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import InfoIcon from '@/assets/icons/info.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import SimpleMarkIcon from '@/assets/icons/simple-marker.svg';
import PhotoBox from '@/components/lost/PhotoBox';
import InfoSectionBox from '@/components/lost/InfoSectionBox';
import CommentSectionBox from '@/components/lost/CommentSectionBox';
import CommentInputBox from '@/components/lost/CommentInputBox';

type PickupDetailScreenRouteProp = RouteProp<
  LostStackParamList,
  'PickupDetail'
>;

type PickupDetailScreenProps = {
  route: PickupDetailScreenRouteProp;
};

const PickupDetailScreen = ({ route }: PickupDetailScreenProps) => {
  const { id } = route.params;
  // todo: API 연동 후 데이터 받아오기
  useEffect(() => {
    console.log(id);
  });
  // todo: API 연동 후 데이터 동적으로 변경 예정
  return (
    <Container>
      <ScollContainer>
        <PhotoBoxContainer>
          <PhotoBox imgSrc='dummyImgSrc' width={232} height={232} />
        </PhotoBoxContainer>
        <InfoSectionBox
          emoji={<InfoIcon width={responsive(18)} height={responsive(18)} />}
          subtitle='상세 설명'
          content='투명테 안경이에요. 파란 안경집에 들어있고, 노란 안경닦이도 있어요.
              젠틀몬스터 제품이에요.'
        />
        <InfoSectionBox
          emoji={
            <SimpleMarkIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='습득 위치'
          content='서울특별시 중구 명동2가 1-1'
          children={
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ width: '100%', height: responsiveVertical(200) }}
              initialRegion={{
                latitude: 35.0894681,
                longitude: 128.8535056,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={{
                  latitude: 35.0894681,
                  longitude: 128.8535056,
                }}
                zIndex={10}
                anchor={{ x: 0.5, y: 0.5 }}
              />
            </MapView>
          }
        />
        <InfoSectionBox
          emoji={
            <SimpleMarkIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='보관 위치'
          content='사거리 CU에 맡겨뒀습니다! 알바분께 부탁드려서 교대하더라도 분실
              카드 있다고 말해달라고 했으니까, 언제든 가서 찾아가시면 될 것
              같아요!'
        />
        <InfoSectionBox
          emoji={
            <CalendarIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='습득 날짜'
          content='2021.09.01 20:49'
        />
        <CommentSectionBox />
      </ScollContainer>
      <CommentInputBox />
    </Container>
  );
};

export default PickupDetailScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const ScollContainer = styled.ScrollView`
  flex: 1;
`;

const PhotoBoxContainer = styled.View`
  align-items: center;
  marginvertical: ${responsiveVertical(8)}px;
`;
