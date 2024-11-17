import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { isAxiosError } from 'axios';
import { getAlertList, deleteAlert } from '@/api/lost';
import { AlertData } from '@/types/lost';
import { colors } from '@/constants';
import { RegisterIcon } from '@/assets/icons';
import { responsive } from '@/utils';
import { showToast, showCustomErrorToast } from '@/utils/toast';
import AlertList from '@/components/lost/AlertList';
import ListOptionModal from '@/components/lost/ListOptionModal';
import CustomText from '@/components/common/CustomText';
import ChoiceDropdownModal from '@/components/lost/ChoiceDropdownModal';

type SOSListScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'SOSList'
>;

type SOSListScreenProps = {
  navigation: SOSListScreenNavigationProp;
};

const SOSListScreen = ({ navigation }: SOSListScreenProps) => {
  const [alertList, setAlertList] = useState<AlertData[]>([]);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

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
              label: 'SOS 목록',
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
      const data = await getAlertList(resourceId, ['lostItem']);
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
    }, [navigation]),
  );
  // 더보기 함수
  const handleLoadMore = () => {
    if (!hasMoreData || alertList.length === 0) return;

    const lastId = alertList[alertList.length - 1].id;
    fetchAlertList(lastId);
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
  const goToDetail = (lostId: number) => {
    navigation.navigate('SOSDetail', { id: lostId });
  };
  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size='large' color={colors.PRIMARY} />
      ) : alertList.length === 0 ? (
        <EmptyText>다른 사용자가 요청한 SOS가 없어요.</EmptyText>
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
      {!selectMode && (
        <RegisterIconBox onPress={() => navigation.navigate('SOSRegister')}>
          <RegisterIcon width={responsive(48)} height={responsive(48)} />
        </RegisterIconBox>
      )}
    </Container>
  );
};

export default SOSListScreen;

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
