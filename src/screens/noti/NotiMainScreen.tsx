import React from 'react';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { getAlertList, getPostByCommentId } from '@/api/lost';
import { AlertData } from '@/types/lost';
import { showCustomErrorToast } from '@/utils';
import CustomText from '@/components/common/CustomText';
import AlertList from '@/components/lost/AlertList';

const NotiMainScreen = () => {
  const [alertList, setAlertList] = useState<AlertData[]>([]);
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchAlertList = async () => {
        try {
          const data = await getAlertList(0, ['comment']);
          setAlertList(data);
        } catch (error) {
          if (isAxiosError(error)) {
            showCustomErrorToast(error.response?.data.message);
          }
          console.error(error);
        }
      };

      fetchAlertList();
    }, []),
  );

  const goToDetail = (commentId: number, type: string | undefined) => {
    const fetchPostByCommentId = async () => {
      try {
        const data = await getPostByCommentId(commentId, type);
        if (data) {
          console.log(data);
        }
        // TODO: 게시글 상세 페이지로 이동
      } catch (error) {
        if (isAxiosError(error)) {
          showCustomErrorToast(error.response?.data.message);
        }
        console.error(error);
      }
    };
    fetchPostByCommentId();
  };

  return (
    <Container>
      {AlertList.length > 0 ? (
        <AlertList
          data={alertList}
          isSelectMode={isSelectMode}
          selected={selected}
          handleSelect={() => {}}
          handleLongPress={() => {}}
          goToDetail={goToDetail}
        />
      ) : (
        <EmptyText>댓글 알림이 없습니다.</EmptyText>
      )}
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
