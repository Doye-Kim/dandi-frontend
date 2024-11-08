import React from 'react';
import { useState, useEffect } from 'react';
import { FlatList, Modal } from 'react-native';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import CustomText from '../common/CustomText';
import PhotoBox from './PhotoBox';
import CustomButton from '../common/CustomButton';

interface QuizData {
  id: number;
  imgSrc: string;
}

interface PickupQuizModalProps {
  inVisible: boolean;
  onClose: () => void;
  onQuizSuccess: () => void;
}

const PickupQuizModal = ({
  inVisible,
  onClose,
  onQuizSuccess,
}: PickupQuizModalProps) => {
  // todo: API 연동 후 데이터 변경 및 인터페이스 정의 변경
  const [quizData, setQuizData] = useState<QuizData[]>([
    { id: 1, imgSrc: 'dummyImgSrc1' },
    { id: 2, imgSrc: 'dummyImgSrc2' },
    { id: 3, imgSrc: 'dummyImgSrc3' },
    { id: 4, imgSrc: 'dummyImgSrc4' },
  ]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  // todo: API 연동시 수정 필요, 퀴즈 제출 시 정답 여부 확인
  // selectedPhotoId를 API 연동 후 서버에 전송하여 정답 여부 확인
  const handleSubmitQuiz = () => {
    const isCorrect = true;
    if (isCorrect) {
      onQuizSuccess();
      onClose();
      Toast.show({
        type: 'success',
        text1: '정답입니다!',
        text2: '습득물 정보를 확인하세요.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: '오답입니다.',
        text2: '습득물 정보를 볼 수 없어요.',
      });
      onClose();
    }
  };

  const handleSelectPhoto = (id: number) => {
    setSelectedPhotoId(id);
  };

  // 모달이 열릴 때 실행할 액션을 useEffect로 관리
  useEffect(() => {
    if (inVisible) {
      // API 연동 후 데이터 불러오는 로직 추가
      setSelectedPhotoId(null);
    }
  }, [inVisible]);

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={inVisible}
      onRequestClose={onClose}>
      <Overlay>
        <Container>
          <QuizHeader>어떤 물품을 잃어버리셨나요?</QuizHeader>
          <PhotoContainer>
            <FlatList
              data={quizData}
              numColumns={2}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: responsive(22),
              }}
              columnWrapperStyle={{
                gap: responsive(22),
              }}
              renderItem={({ item }) => (
                <PhotoBoxContainer
                  isSelected={selectedPhotoId === item.id}
                  onPress={() => handleSelectPhoto(item.id)}>
                  <PhotoBox imgSrc={item.imgSrc} width={140} height={140} />
                </PhotoBoxContainer>
              )}
            />
          </PhotoContainer>
          <ButtonContainer>
            <CustomButton
              title='닫기'
              onPress={onClose}
              style='disable'
              width={responsive(140)}
              height={40}
              padding={10}
              fontSize={12}
            />
            <CustomButton
              title='제출'
              onPress={handleSubmitQuiz}
              style='enable'
              width={140}
              height={40}
              padding={10}
              fontSize={12}
            />
          </ButtonContainer>
        </Container>
      </Overlay>
    </Modal>
  );
};

export default PickupQuizModal;

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.View`
  background-color: ${colors.WHITE};
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: ${responsive(340)}px;
  height: ${responsiveVertical(445)}px;
  border-radius: 30px;
`;

const QuizHeader = styled(CustomText)`
  font-size: ${responsive(16)}px;
  padding: ${responsive(14)}px;
  color: ${colors.BLACK};
`;

const PhotoContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const PhotoBoxContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  border-width: ${({ isSelected }) => (isSelected ? 1 : 0)}px;
  border-color: ${({ isSelected }) =>
    isSelected ? colors.PRIMARY : colors.WHITE};
  border-radius: 30px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  width: 90%;
  margin-top: ${responsiveVertical(20)}px;
`;
