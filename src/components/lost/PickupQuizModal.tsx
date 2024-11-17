import React, { useState } from 'react';
import { FlatList, Modal } from 'react-native';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { BASE_IMAGE_URL } from '@/api/axios';
import { showCustomErrorToast } from '@/utils/toast';
import CustomText from '../common/CustomText';
import PhotoBox from './PhotoBox';
import CustomButton from '../common/CustomButton';

interface QuizOption {
  image: string;
  description: string;
}

interface PickupQuizModalProps {
  inVisible: boolean;
  onClose: () => void;
  onSubmit: (answer: string) => void;
  quizData: QuizOption[];
}

const PickupQuizModal = ({
  inVisible,
  onClose,
  onSubmit,
  quizData,
}: PickupQuizModalProps) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const handleSelectPhoto = (id: string) => {
    setSelectedPhotoId(id);
  };

  const handleSubmitQuiz = () => {
    if (selectedPhotoId !== null) {
      onSubmit(selectedPhotoId);
    } else {
      showCustomErrorToast('퀴즈 정답을 선택해주세요.');
    }
  };

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
                justifyContent: 'space-evenly',
              }}
              renderItem={({ item }) => (
                <PhotoBoxContainer
                  isSelected={selectedPhotoId === item.image}
                  onPress={() => handleSelectPhoto(item.image)}>
                  <PhotoBox
                    imgSrc={`${BASE_IMAGE_URL}${item.image}`}
                    width={responsive(140)}
                    height={responsive(140)}
                  />
                </PhotoBoxContainer>
              )}
              keyExtractor={(item) => item.image}
            />
          </PhotoContainer>
          <ButtonContainer>
            <CustomButton
              title='닫기'
              onPress={onClose}
              style='disable'
              width={responsive(100)}
              height={responsiveVertical(50)}
              fontSize={responsiveVertical(14)}
            />
            <CustomButton
              title='제출'
              onPress={handleSubmitQuiz}
              style='enable'
              width={responsive(100)}
              height={responsiveVertical(50)}
              fontSize={responsiveVertical(14)}
            />
          </ButtonContainer>
        </Container>
      </Overlay>
    </Modal>
  );
};

export default PickupQuizModal;

// 스타일 정의
const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.View`
  background-color: ${colors.WHITE};
  width: 90%;
  height: 62%;
  border-radius: 30px;
  padding-vertical: ${responsive(4)}px;
`;

const QuizHeader = styled(CustomText)`
  font-size: ${responsive(16)}px;
  padding: ${responsive(10)}px;
  color: ${colors.BLACK};
  text-align: center;
`;

const PhotoContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const PhotoBoxContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  border-width: ${({ isSelected }) => (isSelected ? 1 : 0)}px;
  border-color: ${({ isSelected }) =>
    isSelected ? colors.PRIMARY : colors.WHITE};
  border-radius: 10px;
  margin: ${responsive(10)}px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;
`;
