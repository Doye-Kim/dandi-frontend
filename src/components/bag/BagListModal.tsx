import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { BagItem } from './MainBagList';
import HeaderText from '../common/HeaderText';
import CustomModalButton from './CustomModalButton';
import BagListModalItem from './BagListModalItem';

import data from '@/dummy/bag.json';

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
  const [bagData, setBagData] = useState<BagItem[]>();

  useEffect(() => {
    const sortedData = data.sort((a, b) => a.bagOrder - b.bagOrder);
    setBagData(sortedData);
  }, []);

  const handlePressConfirm = () => {
    if (copyBagId === null) {
      Toast.show({
        type: 'error',
        text1: '가방을 선택해 주세요',
      });
    } else onConfirm();
  };
  return (
    <Portal>
      <StyledModal visible={visible} onDismiss={onClose}>
        <HeaderText>복사할 가방 선택</HeaderText>
        <FlatList
          data={bagData}
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
            onPress={onClose}
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
