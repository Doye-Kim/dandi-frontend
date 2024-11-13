import React, { useEffect, useRef, useState } from 'react';
import { Modal, TextInput, Animated } from 'react-native';
import styled from 'styled-components/native';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
  showErrorToast,
} from '@/utils';
import { colors } from '@/constants';
import HeaderText from './HeaderText';
import AuthButton from '../auth/AuthButton';
import {
  useCreateBagMutation,
  useCreateCopyBagMutation,
  useEditBagNameMutation,
} from '@/queries/bagQueries';
import { putUpdateNickname } from '@/api/auth';
import useUserStore from '@/store/useUserStore';
import CustomText from './CustomText';

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  copyBagId?: number;
  bagId?: number;
  name?: string;
  nickname?: string;
}

const InputModal = ({
  visible,
  copyBagId,
  onClose,
  onConfirm,
  bagId,
  name,
  nickname,
}: InputModalProps) => {
  const [newName, setNewName] = useState(name ? name : '');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const nameRef = useRef<TextInput>(null);
  const { setNickname } = useUserStore();

  const handleChangeText = (text: string) => {
    setNewName(text);
  };

  const handleDismiss = () => {
    onClose();
    setNewName(name ? name : nickname ? nickname : '');
  };

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 슬라이드 애니메이션
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 모달이 닫힐 때 슬라이드 애니메이션
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const createMutation = useCreateBagMutation();
  const copyMutation = useCreateCopyBagMutation();
  const editNameMutation = useEditBagNameMutation();

  const handleConfirm = async () => {
    if (!newName) {
      showErrorToast('EMPTY_NAME');
    } else {
      onConfirm();
      setNewName(name ? name : nickname ? nickname : '');
      if (copyBagId) {
        copyMutation.mutate({ bagId: copyBagId, name: newName });
      } else if (bagId) {
        editNameMutation.mutate({ bagId: bagId, name: newName });
      } else if (nickname) {
        try {
          await putUpdateNickname(newName);
          setNickname(newName);
        } catch (error) {
          checkErrorAndViewToast(error);
        }
      } else {
        createMutation.mutate(newName);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='none'
      onRequestClose={handleDismiss}>
      <ModalBackground onPress={handleDismiss}>
        <AnimatedModalContainer
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0], // 아래에서 위로 슬라이드
                }),
              },
            ],
          }}>
          <HeaderText>
            {bagId
              ? '가방 이름 변경'
              : nickname
              ? '닉네임 변경'
              : '나만의 가방 만들기'}
          </HeaderText>
          <TextInputContainer>
            <StyledTextInput
              ref={nameRef}
              placeholder='이름을 입력해 주세요'
              onChangeText={handleChangeText}
              value={newName}
              keyboardType='default'
              multiline={true}
            />
          </TextInputContainer>
          <AuthButton title='확인' onPress={handleConfirm} style='enable' />
        </AnimatedModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default InputModal;

const ModalBackground = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: ${responsive(372)}px;
  padding: ${responsive(20)}px;
  position: absolute;
  bottom: 0;
  background-color: ${colors.WHITE};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const TextInputContainer = styled.View`
  width: ${responsive(352)}px;
  border-width: 1px;
  margin: ${responsive(10)}px;
  padding: ${responsive(5)}px;
  border-radius: ${responsive(20)}px;
  border-color: ${colors.GRAY_500};
`;

const StyledTextInput = styled(TextInput)`
  width: 100%;
  height: ${responsiveVertical(50)}px;
  font-family: 'OAGothic-Medium';
  font-size: 16px;
  background-color: ${colors.WHITE};
  padding: 10px;
  border-radius: 10px;
`;

const AnimatedModalContainer = styled(Animated.View)`
  width: ${responsive(372)}px;
  padding: ${responsive(20)}px;
  position: absolute;
  bottom: 0;
  background-color: ${colors.WHITE};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  justify-content: center;
  align-items: center;
`;
