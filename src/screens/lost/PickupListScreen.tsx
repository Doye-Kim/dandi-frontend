import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { isAxiosError } from 'axios';
import { getAlertList } from '@/api/lost';
import { colors } from '@/constants';
import { responsive, showCustomErrorToast } from '@/utils';
import { RegisterIcon } from '@/assets/icons';
import { AlertData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';
import AlertList from '@/components/lost/AlertList';
import ListOptopmModal from '@/components/lost/ListOptionModal';
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
  const [selectedFoundId, setSelectedFoundId] = useState<null | number>(null);
  // todo: 알람 기준 ID 동적 처리 필요
  useFocusEffect(
    useCallback(() => {
      const fetchAlertList = async () => {
        try {
          const data = await getAlertList(0, ['foundItem']);
          console.log(data);
          setAlertList(data);
        } catch (error) {
          if (isAxiosError(error)) {
            showCustomErrorToast(error.response?.data.message);
          }
        }
      };

      fetchAlertList();
    }, []),
  );

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

  // 선택 모드 전환 함수(버튼 클릭)
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
  const deleteAlert = () => {
    // todo: 삭제 로직 추가
    setSelectMode(false);
    setSelected([]);
  };
  // 상세 페이지 이동 함수
  const tryNavigateToDetail = (foundId: number) => {
    setSelectedFoundId(foundId);
    navigation.navigate('PickupDetail', { id: foundId });
  };

  return (
    <Container>
      {alertList.length === 0 && (
        <EmptyText>다른 사용자들이 등록한 습득물이 없어요.</EmptyText>
      )}
      <AlertList
        data={alertList}
        isSelectMode={selectMode}
        selected={selected}
        handleSelect={handleSelectItem}
        handleLongPress={handleSelectMode}
        goToDetail={tryNavigateToDetail}
      />
      <ListOptopmModal isVisible={selectMode} onDelete={deleteAlert} />

      <RegisterIconBox onPress={() => navigation.navigate('PickupRegister')}>
        <RegisterIcon width={responsive(48)} height={responsive(48)} />
      </RegisterIconBox>
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
