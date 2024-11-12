import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { getAlertList } from '@/api/lost';
import CustomText from '@/components/common/CustomText';

const NotiMainScreen = () => {
  const [AlertList, setAlertList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchAlertList = async () => {
        try {
          const data = await getAlertList(0, ['comment']);
          console.log(data);
          setAlertList(data.items || []);
        } catch (error) {
          console.error(error);
        }
      };

      fetchAlertList();
    }, []),
  );

  return (
    <Container>
      {AlertList.length > 0 ? null : (
        <EmptyText>최근 알림이 없습니다.</EmptyText>
      )}
      <CustomText>1. 댓글 알림</CustomText>
      <CustomText>해야할 일: 클릭 시, 댓글 달린 글 이동</CustomText>
      <CustomText>해야할 일2: 댓글에 스크롤 커서 위치</CustomText>
    </Container>
  );
};
export default NotiMainScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const EmptyText = styled(CustomText)`
  text-align: center;
  margin-top: 20px;
`;
