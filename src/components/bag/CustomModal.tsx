import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { colors, ModalCategory, ModalMessages } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import HeaderText from '../common/HeaderText';
import CustomText from '../common/CustomText';
import CustomModalButton from './CustomModalButton';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  category: ModalCategory;
  name?: string;
}
const CustomModal = ({
  visible,
  onClose,
  onCancel,
  category,
  onConfirm,
  name,
}: CustomModalProps) => {
  const { title, content, rightButton, leftButton } = ModalMessages[category];

  return (
    <Portal>
      <StyledModal visible={visible} onDismiss={onClose}>
        <ModalContent>
          <HeaderText>{title}</HeaderText>
          <ContentText>{name ? `${name} ${content}` : content}</ContentText>
          <ButtonContainer>
            <CustomModalButton
              text={leftButton}
              isEnabled={false}
              onPress={onCancel}
            />
            <CustomModalButton
              text={rightButton}
              isEnabled={true}
              onPress={onConfirm}
            />
          </ButtonContainer>
        </ModalContent>
      </StyledModal>
    </Portal>
  );
};

export default CustomModal;

const StyledModal = styled(Modal).attrs({
  contentContainerStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: responsiveVertical(250),
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
})``;

const ModalContent = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ContentText = styled(CustomText)`
  font-size: 18px;
  color: ${colors.GRAY_700};
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: ${responsive(40)}px;
`;
