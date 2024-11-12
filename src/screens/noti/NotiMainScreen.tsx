import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import CustomText from '@/components/common/CustomText';
import { getAlertList } from '@/api/lost';

const NotiMainScreen = () => {
  const [AlertList, setAlertList] = useState([]);

  useEffect(() => {
    const fetchAlertList = async () => {
      try {
        const data = await getAlertList(0, ['comment', 'route']);
        console.log(data);
        setAlertList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlertList();
  }, []);

  return (
    <Container>
      <CustomText>댓글 알림</CustomText>
      <CustomText>클릭 시, 댓글 달린 글 이동</CustomText>
      <CustomText>댓글에 스크롤 커서 위치</CustomText>
      <CustomText>알람 없을 시에 TEXT 출력</CustomText>
    </Container>
  );
};
export default NotiMainScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;
