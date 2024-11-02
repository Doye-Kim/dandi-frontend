import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsiveVertical } from '@/utils/common';
import TrashBinIcon from '@/assets/icons/trash-bin.svg';

interface ListOptionModalProps {
  isVisible: boolean;
  onDelete: () => void;
}

const ListOptionModal = ({ isVisible, onDelete }: ListOptionModalProps) => {
  return isVisible ? (
    <Overlay>
      <DeleteButton onPress={onDelete}>
        <TrashBinIcon />
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
