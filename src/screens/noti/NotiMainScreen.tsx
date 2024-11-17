import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import {
  getAlertList,
  getPostByCommentId,
  deleteAlert,
  readAlert,
} from '@/api/lost';
import { AlertData } from '@/types/lost';
import { showCustomErrorToast, showToast } from '@/utils';
import { responsive } from '@/utils';
import CustomText from '@/components/common/CustomText';
import AlertList from '@/components/lost/AlertList';
import ListOptionModal from '@/components/lost/ListOptionModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotiStackParamList } from '@/navigations/stack/NotiStackNavigator';

type NotiMainScreenNavigationProp = StackNavigationProp<
  NotiStackParamList,
  'NotiMain'
>;

type NotiMainScreenProps = {
  navigation: NotiMainScreenNavigationProp;
};

const NotiMainScreen = ({ navigation }: NotiMainScreenProps) => {
  const [alertList, setAlertList] = useState<AlertData[]>([]);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [resourceId, setResourceId] = useState<number>(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <EditButton onPress={toggleSelectMode}>
          <EditButtonText>{selectMode ? '완료' : '편집'}</EditButtonText>
        </EditButton>
      ),
    });
  }, [navigation, selectMode]);

  const fetchAlertList = async (resourceId: number) => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    try {
      const data = await getAlertList(resourceId, ['comment']);
      // 맨 처음 데이터일 경우 => 덮어쓰기, 아닐 경우 => 이어붙이기
      setAlertList((prev) => {
        console.log('prev', prev);
        if (resourceId === 0) {
          return data;
        }
        return [...prev, ...data];
      });
      setHasMoreData(data.length >= 20);
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Updated alertList:', alertList);
  }, [alertList]);

  useFocusEffect(
    useCallback(() => {
      fetchAlertList(0);

      return () => {
        setAlertList([]);
        setSelectMode(false);
        setSelected([]);
        setIsLoading(false);
        setHasMoreData(true);
        setResourceId(0);
      };
    }, [navigation]),
  );

  useEffect(() => {
    if (resourceId !== 0) {
      fetchAlertList(resourceId);
    }
  }, [resourceId]);

  // 더보기 함수 수정
  const handleLoadMore = () => {
    if (isLoading || !hasMoreData || alertList.length === 0) return;

    const lastId = alertList[alertList.length - 1]?.id;
    if (lastId) {
      setResourceId(lastId);
      if (lastId && resourceId !== lastId) {
        setResourceId(lastId);
      }
    }
  };
  // 선택 모드 전환 함수(편집, 완료)
  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelected([]);
  };
  // 선택 모드 지정 함수
  const handleSelectMode = (id: number) => {
    setSelectMode(true);
    setSelected([id]);
  };
  // 목록 선택 함수
  const handleSelectItem = (id: number) => {
    if (!selectMode) return;

    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((el) => el !== id);
      }
      return [...prev, id];
    });
  };
  // 알람 목록 삭제 함수
  const deleteAlertList = async () => {
    if (selected.length === 0) {
      showCustomErrorToast('삭제할 알림을 선택해주세요.');
      return;
    }
    try {
      await deleteAlert(selected);
      showToast('알림이 삭제되었습니다.');
      setAlertList((prev) =>
        prev.filter((item) => !selected.includes(item.id)),
      );
      setSelectMode(false);
      setSelected([]);
      setIsLoading(true);
      await fetchAlertList(0);
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // 상세 페이지 이동 함수
  const goToDetail = (
    commentId: number,
    readId: number | undefined,
    type: string | undefined,
  ) => {
    const fetchPostByCommentId = async () => {
      if (readId !== undefined) {
        readAlert(readId, 'comment').catch((error) => {
          console.warn('알림 읽기 실패', error);
        });
      }
      try {
        const data = await getPostByCommentId(commentId, type);
        if (type === 'foundComment') {
          navigation.navigate('PickupDetail', { id: data.itemId });
        } else if (type === 'lostComment') {
          navigation.navigate('SOSDetail', { id: data.itemId });
        }
      } catch (error) {
        if (isAxiosError(error)) {
          showCustomErrorToast(error.response?.data.message);
        }
      }
    };
    fetchPostByCommentId();
  };

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size='large' color={colors.PRIMARY} />
      ) : alertList.length === 0 ? (
        <EmptyText>댓글 알림이 없어요.</EmptyText>
      ) : (
        <AlertList
          data={alertList}
          isSelectMode={selectMode}
          selected={selected}
          handleSelect={handleSelectItem}
          handleLongPress={handleSelectMode}
          goToDetail={goToDetail}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          isLoading={isLoading}
        />
      )}
      <ListOptionModal isVisible={selectMode} onDelete={deleteAlertList} />
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
  margin-top: ${responsive(20)}px;
`;

const EditButton = styled.TouchableOpacity`
  margin-right: 16px;
`;

const EditButtonText = styled(CustomText)`
  color: ${colors.GRAY_700};
`;
