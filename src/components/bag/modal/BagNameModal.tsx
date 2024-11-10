import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { responsive, responsiveVertical, showErrorToast } from '@/utils';
import { colors } from '@/constants';
import HeaderText from '../../common/HeaderText';
import AuthButton from '../../auth/AuthButton';
import {
  useCreateBagMutation,
  useCreateCopyBagMutation,
  useEditBagNameMutation,
} from '@/queries/bagQueries';

interface BagNameModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  copyBagId?: number;
  bagId?: number;
  name?: string;
}
const BagNameModal = ({
  visible,
  copyBagId,
  onClose,
  onConfirm,
  bagId,
  name,
}: BagNameModalProps) => {
  const [bagName, setBagName] = useState(name ? name : '');
  const bagNameRef = useRef<TextInput>(null);

  const handleChangeText = (text: string) => {
    setBagName(text);
  };

  const handleDismiss = () => {
    onClose();
    setBagName(name ? name : '');
  };
  useEffect(() => {
    if (visible && bagNameRef.current) {
      bagNameRef.current.focus();
    }
  }, [visible]);

  const createMutation = useCreateBagMutation();
  const copyMutation = useCreateCopyBagMutation();
  const editNameMutation = useEditBagNameMutation();
  const handleCreateBag = () => {
    if (!bagName || bagName === '') {
      showErrorToast('이름을 입력해 주세요');
    } else {
      onConfirm();
      setBagName(name ? name : '');
      if (copyBagId) {
        copyMutation.mutate({ bagId: copyBagId, name: bagName });
      } else if (bagId) {
        console.log('edit', { bagId: bagId, name: bagName });
        editNameMutation.mutate({ bagId: bagId, name: bagName });
      } else {
        createMutation.mutate(bagName);
      }
    }
  };

  return (
    <Portal>
      <StyledModal visible={visible} onDismiss={handleDismiss}>
        <HeaderText>
          {bagId ? '가방 이름 변경' : '나만의 가방 만들기'}
        </HeaderText>
        <TextInputContainer>
          <StyledTextInput
            ref={bagNameRef}
            placeholder='가방의 이름을 입력해 주세요'
            onChangeText={handleChangeText}
            value={bagName}
          />
        </TextInputContainer>
        <AuthButton title='확인' onPress={handleCreateBag} style='enable' />
      </StyledModal>
    </Portal>
  );
};

export default BagNameModal;

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
