import React from 'react';
import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { RouteProp } from '@react-navigation/native';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import { PickupDetailData } from '@/types/lost';
import { showCustomErrorToast } from '@/utils/toast';
import styled from 'styled-components/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '@/constants';
import { showToast } from '@/utils/toast';
import { responsive, responsiveVertical } from '@/utils/common';
import { convertDateTimeFormat } from '@/utils/date';
import { getPickupDetail, submitPickupQuiz } from '@/api/lost';
import { BASE_IMAGE_URL } from '@/api/axios';
import { CommentData } from '@/types/lost';
import { getPickupQuiz, getPickupComments } from '@/api/lost';
import InfoIcon from '@/assets/icons/info.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import SimpleMarkIcon from '@/assets/icons/simple-marker.svg';
import PhotoBox from '@/components/lost/PhotoBox';
import InfoSectionBox from '@/components/lost/InfoSectionBox';
import CommentSectionBox from '@/components/lost/CommentSectionBox';
import CommentInputBox from '@/components/lost/CommentInputBox';
import PickupQuizModal from '@/components/lost/PickupQuizModal';

type PickupDetailScreenRouteProp = RouteProp<
  LostStackParamList,
  'PickupDetail'
>;

type PickupDetailScreenProps = {
  route: PickupDetailScreenRouteProp;
  navigation: PickupListScreenNavigationProp;
};

type PickupListScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'PickupDetail'
>;

const PickupDetailScreen = ({ route, navigation }: PickupDetailScreenProps) => {
  const { id } = route.params;
  const [details, setDetails] = useState<PickupDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [quizModalVisible, setQuizModalVisible] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<null | any>(null);

  const fetchComments = async () => {
    try {
      const data = await getPickupComments(id);
      setComments(data.payloads);
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
      }
    }
  };

  const handleCommentSubmit = async () => {
    fetchComments();
    setParentId(null);
  };

  useEffect(() => {
    const fetchPickupDetail = async () => {
      try {
        const data = await getPickupDetail(id);
        console.log(data);
        setDetails(data);
        fetchComments();
      } catch (error) {
        console.error(error);
        if (isAxiosError(error)) {
          const errorData = error.response?.data;
          if (errorData.code === 'E407') {
            showCustomErrorToast(error.response?.data.message);
            tryQuiz(id);
          } else {
            navigation.navigate('PickupList');
            showCustomErrorToast(error.response?.data.message);
          }
        }
      }
    };
    fetchPickupDetail();
  }, [id, quizModalVisible]);

  // 퀴즈 데이터 조회 함수
  const tryQuiz = async (foundId: number) => {
    try {
      const data = await getPickupQuiz(foundId);
      setQuizData(data);
      setQuizModalVisible(true);
    } catch (error) {
      showCustomErrorToast('퀴즈 데이터를 불러오지 못했습니다.');
    }
  };
  // 퀴즈 제출 함수
  const handleQuizSubmit = async (answer: string) => {
    if (!answer) {
      showCustomErrorToast('퀴즈 정답을 선택해주세요.');
      return;
    }
    try {
      const data = await submitPickupQuiz(id, answer);
      if (data.result) {
        setQuizModalVisible(false);
        setQuizData(null);
        showToast('정답입니다! 상세 정보를 확인하세요!');
        navigation.navigate('PickupDetail', { id: id });
      } else {
        showCustomErrorToast('퀴즈 정답이 틀렸습니다.');
        navigation.navigate('PickupList');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
        navigation.navigate('PickupList');
      }
    }
  };

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
          content={details?.address}
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
            memberId={details.memberId}
            comments={comments}
            onReply={(commentId) => setParentId(commentId)}
          />
        )}
      </ScollContainer>
      {details?.id && (
        <CommentInputBox
          type='PICKUP'
          articleId={details.id}
          parentId={parentId}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
      {/* 퀴즈 모달 */}
      <PickupQuizModal
        inVisible={quizModalVisible}
        quizData={quizData ? quizData.options : []}
        onClose={() => {
          setQuizModalVisible(false);
          setQuizData(null);
          navigation.navigate('PickupList');
        }}
        onSubmit={handleQuizSubmit}
      />
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
