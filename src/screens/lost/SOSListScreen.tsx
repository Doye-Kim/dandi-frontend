import React from 'react';
import { useState, useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { getAlertList } from '@/api/lost';
import { AlertData } from '@/types/lost';
import { colors } from '@/constants';
import { RegisterIcon } from '@/assets/icons';
import { responsive } from '@/utils';
import AlertList from '@/components/lost/AlertList';
import ListOptopmModal from '@/components/lost/ListOptionModal';
import CustomText from '@/components/common/CustomText';

type SOSListScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'SOSList'
>;

type SOSListScreenProps = {
  navigation: SOSListScreenNavigationProp;
};

const SOSListScreen = ({ navigation }: SOSListScreenProps) => {
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [alertList, setAlertList] = useState<AlertData[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchAlertList = async () => {
        try {
          const data = await getAlertList(0, ['lostItem']);
          console.log(data);
          setAlertList(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchAlertList();
    }, []),
  );

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
  const deleteAlert = () => {
    // todo: 삭제 로직 추가
    setSelectMode(false);
    setSelected([]);
  };

  return (
    <Container>
      {alertList.length === 0 && (
        <EmptyText>다른 사용자들이 요청한 SOS가 없어요.</EmptyText>
      )}
      <AlertList
        data={alertList}
        isSelectMode={selectMode}
        selected={selected}
        handleSelect={handleSelectItem}
        handleLongPress={handleSelectMode}
        goToDetail={(id) => navigation.navigate('SOSDetail', { id: id })}
      />
      <ListOptopmModal isVisible={selectMode} onDelete={deleteAlert} />
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
