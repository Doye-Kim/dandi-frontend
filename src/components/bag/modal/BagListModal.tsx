import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
  showErrorToast,
} from '@/utils';
import HeaderText from '../../common/HeaderText';
import CustomModalButton from './CustomModalButton';
import BagListModalItem from './BagListModalItem';
import { useBagQuery } from '@/queries/bagQueries';

interface BagListModalProps {
  visible: boolean;
  copyBagId: number | null;
  setCopyBagId: (copyBagId: number | null) => void;
  onClose: () => void;
  onConfirm: () => void;
}
const BagListModal = ({
  visible,
  copyBagId,
  setCopyBagId,
  onClose,
  onConfirm,
}: BagListModalProps) => {
  const { data: bagList, error } = useBagQuery();

  useEffect(() => {
    if (error) {
      checkErrorAndViewToast(error);
    }
  }, [error]);

  const handlePressConfirm = () => {
    if (copyBagId === null) {
      showErrorToast('SELECT_BAG');
    } else onConfirm();
  };

  const handleDismiss = () => {
    onClose();
    setCopyBagId(null);
  };
  return (
    <Portal>
      <StyledModal visible={visible} onDismiss={handleDismiss}>
        <HeaderText>복사할 가방 선택</HeaderText>
        <FlatList
          data={bagList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BagListModalItem
              item={item}
              copyBagId={copyBagId}
              setCopyBagId={setCopyBagId}
            />
          )}
          style={{ maxHeight: 200 }}
        />
        <ButtonContainer>
          <CustomModalButton
            text={'취소'}
            isEnabled={false}
            onPress={handleDismiss}
          />
          <CustomModalButton
            text={'완료'}
            isEnabled={true}
            onPress={handlePressConfirm}
          />
        </ButtonContainer>
      </StyledModal>
    </Portal>
  );
};

export default BagListModal;

const StyledModal = styled(Modal).attrs({
  contentContainerStyle: {
    width: responsive(372),
    height: responsiveVertical(400),
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: responsiveVertical(30),
  },
})``;

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
  padding-horizontal: 20px;
  justify-content: space-around;
`;
