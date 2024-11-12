import React from 'react';
import { useState, useEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import { PickupDetailData } from '@/types/lost';
import styled from 'styled-components/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { convertDateTimeFormat } from '@/utils/date';
import { getPickupDetail } from '@/api/lost';
import { BASE_IMAGE_URL } from '@/api/axios';
import { CommentData } from '@/types/lost';
import { getPickupComments } from '@/api/lost';
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
  const [details, setDetails] = useState<PickupDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);

  const fetchComments = async () => {
    try {
      const data = await getPickupComments(id);
      setComments(data.payloads);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchPickupDetail = async () => {
      try {
        const data = await getPickupDetail(id);
        setDetails(data);
        fetchComments();
      } catch (error) {
        console.error(error);
      }
    };
    fetchPickupDetail();
  }, [id]);

  return (
    <Container>
      <ScollContainer>
        <PhotoBoxContainer>
          <PhotoBox
            imgSrc={`${BASE_IMAGE_URL}${details?.image}`}
            width={responsive(232)}
            height={responsive(232)}
          />
        </PhotoBoxContainer>
        <InfoSectionBox
          emoji={<InfoIcon width={responsive(18)} height={responsive(18)} />}
          subtitle='상세 설명'
          content={details?.description}
        />
        <InfoSectionBox
          emoji={
            <SimpleMarkIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='습득 위치'
          content='서울특별시 중구 명동2가 1-1(동적 변경 필요)'
          children={
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ width: '100%', height: responsiveVertical(200) }}
              region={{
                latitude: details?.foundLocation.lat ?? 0,
                longitude: details?.foundLocation.lon ?? 0,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
              }}>
              <Marker
                coordinate={{
                  latitude: details?.foundLocation.lat ?? 0,
                  longitude: details?.foundLocation.lon ?? 0,
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
          content={details?.savePoint}
        />
        <InfoSectionBox
          emoji={
            <CalendarIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='습득 날짜'
          content={
            details?.foundAt
              ? convertDateTimeFormat(new Date(details.foundAt))
              : ''
          }
        />
        {details?.id && (
          <CommentSectionBox
            type='PICKUP'
            id={details.id}
            comments={comments}
          />
        )}
      </ScollContainer>
      {details?.id && (
        <CommentInputBox
          type='PICKUP'
          id={details.id}
          onCommentSubmit={fetchComments}
        />
      )}
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
