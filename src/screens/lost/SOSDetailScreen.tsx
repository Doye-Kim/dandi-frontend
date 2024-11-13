import React from 'react';
import { useState, useEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { isAxiosError } from 'axios';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { convertDateTimeFormat } from '@/utils/date';
import { getSOSDetail, getSOSComments } from '@/api/lost';
import { BASE_IMAGE_URL } from '@/api/axios';
import { SOSDetailData, CommentData } from '@/types/lost';
import { showCustomErrorToast } from '@/utils/toast';
import InfoIcon from '@/assets/icons/info.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import SimpleMarkIcon from '@/assets/icons/simple-marker.svg';
import PhotoBox from '@/components/lost/PhotoBox';
import InfoSectionBox from '@/components/lost/InfoSectionBox';
import CommentSectionBox from '@/components/lost/CommentSectionBox';
import CommentInputBox from '@/components/lost/CommentInputBox';

type SOSDetailScreenRouteProp = RouteProp<LostStackParamList, 'SOSDetail'>;

type SOSDetailScreenProps = {
  route: SOSDetailScreenRouteProp;
};

const SOSDetailScreen = ({ route }: SOSDetailScreenProps) => {
  const { id } = route.params;
  const [details, setDetails] = useState<SOSDetailData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);

  const fetchComments = async () => {
    try {
      const data = await getSOSComments(id);
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
    const fetchSOSDetail = async () => {
      try {
        const data = await getSOSDetail(id);
        setDetails(data);
        fetchComments();
      } catch (error) {
        if (isAxiosError(error)) {
          showCustomErrorToast(error.response?.data.message);
        }
      }
    };
    fetchSOSDetail();
  }, [id]);

  return (
    <Container>
      <ScollContainer>
        <PhotoBoxContainer>
          <PhotoBox
            imgSrc={`${BASE_IMAGE_URL}${details?.images[0]}`}
            width={responsive(232)}
            height={responsive(232)}
          />
        </PhotoBoxContainer>
        <InfoSectionBox
          emoji={<InfoIcon width={responsive(18)} height={responsive(18)} />}
          subtitle='상세 설명'
          content={details?.itemDescription}
        />

        <InfoSectionBox
          emoji={
            <SimpleMarkIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='분실 위치'
          content={details?.situationDescription}
        />
        <InfoSectionBox
          emoji={
            <CalendarIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='분실 날짜'
          content={
            details?.lostAt
              ? convertDateTimeFormat(new Date(details.lostAt))
              : ''
          }
        />
        {details?.id && (
          <CommentSectionBox
            type='SOS'
            memberId={details.memberId}
            comments={comments}
            onReply={(commentId) => setParentId(commentId)}
          />
        )}
      </ScollContainer>
      {details?.id && (
        <CommentInputBox
          type='SOS'
          articleId={details.id}
          parentId={parentId}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
    </Container>
  );
};

export default SOSDetailScreen;

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
