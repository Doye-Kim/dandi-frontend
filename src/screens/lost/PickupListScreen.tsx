import React from 'react';
import { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { RegisterIcon } from '@/assets/icons';
import AlertList from '@/components/lost/AlertList';
import ListOptopmModal from '@/components/lost/ListOptionModal';
import PickupQuizModal from '@/components/lost/PickupQuizModal';
import ChoiceDropdownModal from '@/components/lost/ChoiceDropdownModal';

type PickupListScreenNavigationProp = StackNavigationProp<
  LostStackParamList,
  'PickupList'
>;

type PickupListScreenProps = {
  navigation: PickupListScreenNavigationProp;
};

const PickupListScreen = ({ navigation }: PickupListScreenProps) => {
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<null | number>(null);
  const [quizModalVisible, setQuizModalVisible] = useState<boolean>(false);
  // todo: API 연동 후 데이터 변경
  const pickupData = [
    {
      id: 1,
      type: 'lostItem',
      read: false,
      date: '2021-09-01',
      title: '1. 현재 위치에 습득물이 등록됐어요!',
    },
    {
      id: 2,
      type: 'lostItem',
      read: true,
      date: '2021-09-02',
      title: '2. 현재 위치에 습득물이 등록됐어요!',
    },
    {
      id: 3,
      type: 'lostItem',
      read: false,
      date: '2021-09-03',
      title: '3. 현재 위치에 습득물이 등록됐어요!',
    },
    {
      id: 4,
      type: 'lostItem',
      read: true,
      date: '2021-09-04',
      title: '4. 현재 위치에 습득물이 등록됐어요!',
    },
    {
      id: 5,
      type: 'lostItem',
      read: false,
      date: '2021-09-05',
      title: '5. 현재 위치에 습득물이 등록됐어요!',
    },
  ];

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
    setSelected([]); // 선택 초기화
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
  // 상세 페이지 이동 전 퀴즈 시도 함수
  const tryQuiz = (id: number) => {
    setSelectedItemId(id);
    setQuizModalVisible(true);
  };

  // 퀴즈 성공 시 상세 페이지로 이동하는 함수
  const handleQuizSuccess = () => {
    // todo: 퀴즈 성공 시 상세 페이지로 이동
    if (selectedItemId !== null) {
      navigation.navigate('PickupDetail', { id: selectedItemId });
      setQuizModalVisible(false);
      setSelectedItemId(null);
    }
  };

  return (
    <Container>
      <AlertList
        data={pickupData}
        isSelectMode={selectMode}
        selected={selected}
        handleSelect={handleSelectItem}
        handleLongPress={handleSelectMode}
        goToDetail={tryQuiz}
      />
      <ListOptopmModal isVisible={selectMode} onDelete={deleteAlert} />
      <PickupQuizModal
        inVisible={quizModalVisible}
        onClose={() => setQuizModalVisible(false)}
        onQuizSuccess={handleQuizSuccess}
      />
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
