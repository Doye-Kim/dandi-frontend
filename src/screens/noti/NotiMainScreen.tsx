import React from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import CustomText from '@/components/common/CustomText';
import AlertList from '@/components/lost/AlertList';

const NotiMainScreen = () => {
  const [AlertList, setAlertList] = useState([]);

  return (
    <Container>
      <CustomText>댓글 알림</CustomText>
      <CustomText>클릭 시, 댓글 달린 글 이동</CustomText>
      <CustomText>댓글에 스크롤 커서 위치</CustomText>
    </Container>
  );
};
export default NotiMainScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;
