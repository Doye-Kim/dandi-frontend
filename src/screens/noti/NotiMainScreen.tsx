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
import { getAlertList, getPostByCommentId, deleteAlert } from '@/api/lost';
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

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
      setAlertList((prev) => {
        const mergedData =
          resourceId === 0 ? [...data, ...prev] : [...prev, ...data];
        return mergedData.filter(
          (item, index, self) =>
            self.findIndex((t) => t.id === item.id) === index,
        );
      });
      setHasMoreData(data.length >= 20);
      console.log(alertList);
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAlertList(0);
    }, [navigation]),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchAlertList(0);
  //   }, [navigation]),
  // );

  // 더보기 함수
  const handleLoadMore = () => {
    if (isLoading || !hasMoreData || alertList.length === 0) return;

    const lastId = alertList[alertList.length - 1]?.id;
    if (lastId) {
      fetchAlertList(lastId);
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
  const goToDetail = (commentId: number, type: string | undefined) => {
    const fetchPostByCommentId = async () => {
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
          onEndReachedThreshold={0.8}
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
