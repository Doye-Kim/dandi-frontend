import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { getAlertList, getPickupQuiz, submitPickupQuiz } from '@/api/lost';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { RegisterIcon } from '@/assets/icons';
import CustomText from '@/components/common/CustomText';
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
  const [alertList, setAlertList] = useState<[]>([]);
  const [quizData, setQuizData] = useState<null | any>(null);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedFoundId, setSelectedFoundId] = useState<null | number>(null);
  const [quizModalVisible, setQuizModalVisible] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const fetchAlertList = async () => {
        try {
          const data = await getAlertList(0, ['foundItem']);
          console.log(data);
          setAlertList(data);
        } catch (error) {
          console.error(error);
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
  // 상세 페이지 이동 전 퀴즈 시도 함수
  const tryQuiz = async (foundId: number) => {
    setSelectedFoundId(foundId);
    try {
      const quiz = await getPickupQuiz(foundId); // 퀴즈 데이터를 가져옴
      setQuizData(quiz);
      setQuizModalVisible(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '권한이 없습니다.',
        text2: '퀴즈 데이터를 불러오지 못했습니다.',
      });
    }
  };
  // 퀴즈 성공 시 상세 페이지로 이동하는 함수
  const handleQuizSubmit = async (answer: string) => {
    if (!selectedFoundId || !quizData) return;

    try {
      const result = await submitPickupQuiz(selectedFoundId, answer);
      if (result.success) {
        navigation.navigate('PickupDetail', { id: selectedFoundId });
        setQuizModalVisible(false);
        setSelectedFoundId(null);
        setQuizData(null);
      } else {
        setQuizModalVisible(false);
        setSelectedFoundId(null);
        setQuizData(null);
        Toast.show({
          type: 'error',
          text1: '퀴즈를 다시 확인해주세요.',
        });
      }
    } catch (error) {
      // todo: 예외 처리 추가
      Toast.show({
        type: 'error',
        text1: '퀴즈 제출에 실패했습니다.',
      });
    }
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
        goToDetail={tryQuiz}
      />
      <ListOptopmModal isVisible={selectMode} onDelete={deleteAlert} />
      <PickupQuizModal
        inVisible={quizModalVisible}
        quizData={quizData ? quizData.options : []}
        onClose={() => setQuizModalVisible(false)}
        onSubmit={handleQuizSubmit}
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

const EmptyText = styled(CustomText)`
  text-align: center;
  margin-top: ${responsive(20)}px;
`;
