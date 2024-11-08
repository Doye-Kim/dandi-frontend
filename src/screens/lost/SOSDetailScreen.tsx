import React from 'react';
import { useEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
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
  // todo: API 연동 후 데이터 받아오기
  useEffect(() => {
    console.log(id);
  });

  return (
    <Container>
      <ScollContainer>
        <PhotoBoxContainer>
          <PhotoBox imgSrc='dummyImgSrc' width={232} height={232} />
        </PhotoBoxContainer>
        <InfoSectionBox
          emoji={<InfoIcon width={responsive(18)} height={responsive(18)} />}
          subtitle='상세 설명'
          content='투명테 안경을 잃어버렸어요..파란 안경집에 들어있고 노란 안경닦이도 있어요..좀 힙합 안경처럼 생겼어요.기리보이가 쓰고 다닐법한 안경이예요'
        />

        <InfoSectionBox
          emoji={
            <SimpleMarkIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='분실 위치'
          content='한신포차에서 술 마시다가 CU 들렀다가 집에 갔으니까 그 근처일 것 같아요..'
        />
        <InfoSectionBox
          emoji={
            <CalendarIcon width={responsive(18)} height={responsive(18)} />
          }
          subtitle='분실 날짜'
          content='2021.09.01 20:49'
        />
        {/* SOS 작성자만 댓글 확인 가능 */}
        <CommentSectionBox />
      </ScollContainer>
      <CommentInputBox />
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
