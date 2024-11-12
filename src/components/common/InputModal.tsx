import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import axios from 'axios';
import {
  responsive,
  responsiveVertical,
  showCustomErrorToast,
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
import { getEncryptStorage, setEncryptStorage } from '@/utils/encryptedStorage';
import useUserStore from '@/store/useUserStore';

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
    if (visible && nameRef.current) {
      nameRef.current.focus();
    }
  }, [visible]);

  const createMutation = useCreateBagMutation();
  const copyMutation = useCreateCopyBagMutation();
  const editNameMutation = useEditBagNameMutation();

  const handleCreateBag = async () => {
    if (!newName || newName === '') {
      showErrorToast('이름을 입력해 주세요');
    } else {
      onConfirm();
      setNewName(name ? name : nickname ? nickname : '');
      if (copyBagId) {
        copyMutation.mutate({ bagId: copyBagId, name: newName });
      } else if (bagId) {
        console.log('edit', { bagId: bagId, name: newName });
        editNameMutation.mutate({ bagId: bagId, name: newName });
      } else if (nickname) {
        try {
          await putUpdateNickname(newName);
          setNickname(newName);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.data) {
            const { code, message } = error.response.data as {
              code: string;
              message: string;
            };
            showCustomErrorToast(message);
          }
        }
      } else {
        createMutation.mutate(newName);
      }
    }
  };

  return (
    <Portal>
      <StyledModal visible={visible} onDismiss={handleDismiss}>
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
            value={name}
          />
        </TextInputContainer>
        <AuthButton title='확인' onPress={handleCreateBag} style='enable' />
      </StyledModal>
    </Portal>
  );
};

export default InputModal;

const StyledModal = styled(Modal).attrs({
  contentContainerStyle: {
    width: responsive(372),
    height: responsiveVertical(240),
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
})``;

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
`;
