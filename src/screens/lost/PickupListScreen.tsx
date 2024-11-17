import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { isAxiosError } from 'axios';
import { getAlertList, deleteAlert, readAlert } from '@/api/lost';
import { colors } from '@/constants';
import { responsive, showCustomErrorToast, showToast } from '@/utils';
import { RegisterIcon } from '@/assets/icons';
import { AlertData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';
import AlertList from '@/components/lost/AlertList';
import ListOptionModal from '@/components/lost/ListOptionModal';
import ChoiceDropdownModal from '@/components/lost/ChoiceDropdownModal';

type PickupListScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'PickupList'
>;

type PickupListScreenProps = {
  navigation: PickupListScreenNavigationProp;
};

const PickupListScreen = ({ navigation }: PickupListScreenProps) => {
  const [alertList, setAlertList] = useState<AlertData[]>([]);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [resourceId, setResourceId] = useState<number>(0);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ChoiceDropdownModal
          isSelectMode={selectMode}
          handleSelect={toggleSelectMode}
          options={[
            {
              label: '습득물 목록',
              onPress: () => navigation.navigate('PickupList'),
            },
            {
              label: '분실물 목록',
              onPress: () => navigation.navigate('SOSList'),
            },
          ]}
        />
      ),
    });
  }, [navigation, selectMode]);
  // 알림 목록 불러오기 함수
  const fetchAlertList = async (resourceId: number) => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    try {
      const data = await getAlertList(resourceId, ['foundItem']);
      setAlertList((prev) =>
        resourceId === 0 ? [...data] : [...prev, ...data],
      );
      console.log(data);
      setHasMoreData(data.length >= 20);
    } catch (error) {
      if (isAxiosError(error)) {
        showCustomErrorToast(error.response?.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // 화면 진입 시 알람 목록 불러오기
  useFocusEffect(
    useCallback(() => {
      fetchAlertList(0);

      return () => {
        setAlertList([]);
        setSelectMode(false);
        setSelected([]);
        setIsLoading(false);
        setHasMoreData(true);
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
  // 선택 모드 지정 함수(LongPress)
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
  const tryNavigateToDetail = (foundId: number, readId: number | undefined) => {
    if (readId !== undefined) {
      readAlert(readId, 'foundItem').catch((error) => {
        console.warn('알림 읽기 실패', error);
      });
    }
    navigation.navigate('PickupDetail', { id: foundId });
  };

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size='large' color={colors.PRIMARY} />
      ) : alertList.length === 0 ? (
        <EmptyText>다른 사용자가 등록한 습득물이 없어요.</EmptyText>
      ) : (
        <AlertList
          data={alertList}
          isSelectMode={selectMode}
          selected={selected}
          handleSelect={handleSelectItem}
          handleLongPress={handleSelectMode}
          goToDetail={tryNavigateToDetail}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
        />
      )}
      <ListOptionModal isVisible={selectMode} onDelete={deleteAlertList} />
      {!selectMode && (
        <RegisterIconBox onPress={() => navigation.navigate('PickupRegister')}>
          <RegisterIcon width={responsive(48)} height={responsive(48)} />
        </RegisterIconBox>
      )}
    </Container>
  );
};

export default PickupListScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const RegisterIconBox = styled.TouchableOpacity`
  position: absolute;
  right: ${responsive(20)}px;
  bottom: ${responsive(20)}px;
`;

const EmptyText = styled(CustomText)`
  text-align: center;
  margin-top: ${responsive(20)}px;
`;
