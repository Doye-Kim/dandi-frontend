import React from 'react';
import { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { RegisterIcon } from '@/assets/icons';
import { responsive } from '@/utils';
import AlertList from '@/components/lost/AlertList';
import ListOptopmModal from '@/components/lost/ListOptionModal';

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
  const [selectedItemId, setSelectedItemId] = useState<null | number>(null);
  const sosData = [
    {
      id: 1,
      type: 'sos',
      read: false,
      date: '2021-09-01',
      title: '1. 현재 위치에 SOS가 등록됐어요!',
    },
    {
      id: 2,
      type: 'sos',
      read: true,
      date: '2021-09-02',
      title: '2. 현재 위치에 SOS가 등록됐어요!',
    },
    {
      id: 3,
      type: 'sos',
      read: false,
      date: '2021-09-03',
      title: '3. 현재 위치에 SOS가 등록됐어요!',
    },
    {
      id: 4,
      type: 'sos',
      read: true,
      date: '2021-09-04',
      title: '4. 현재 위치에 SOS가 등록됐어요!',
    },
    {
      id: 5,
      type: 'sos',
      read: false,
      date: '2021-09-05',
      title: '5. 현재 위치에 SOS가 등록됐어요!',
    },
  ];

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
      <AlertList
        data={sosData}
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
