import React from 'react';
import { Text, Modal } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import CustomText from '../common/CustomText';

interface ListOptionModalProps {
  isVisible: boolean;
  onDelete: () => void;
}

const ListOptionModal = ({ isVisible, onDelete }: ListOptionModalProps) => {
  return isVisible ? (
    <Overlay>
      <DeleteButton onPress={onDelete}>
        <CustomText style={{ color: colors.BLACK }}>삭제</CustomText>
      </DeleteButton>
    </Overlay>
  ) : (
    <></>
  );
};

export default ListOptionModal;

const Overlay = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  height: ${responsiveVertical(70)}px;
  background-color: ${colors.BLACK};
  align-items: center;
  justify-content: center;
  opacity: 0.2;
`;

const DeleteButton = styled.TouchableOpacity`
  height: ${responsiveVertical(70)}px;
  align-items: center;
  justify-content: center;
`;
