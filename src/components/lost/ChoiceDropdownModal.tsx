// ChoiceDropdownModal.tsx
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { ArrowDownIcon } from '@/assets/icons';
import CustomText from '@/components/common/CustomText';
import { responsive } from '@/utils';

interface ChoiceDropdownModalProps {
  isSelectMode: boolean;
  handleSelect: () => void;
  options: { label: string; onPress: () => void }[];
}

const ChoiceDropdownModal = ({
  isSelectMode,
  handleSelect,
  options,
}: ChoiceDropdownModalProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <Container>
      <TouchableOpacity onPress={toggleDropdown}>
        <ArrowDownIcon />
      </TouchableOpacity>
      <EditButton onPress={handleSelect}>
        <EditButtonText>{isSelectMode ? '완료' : '편집'}</EditButtonText>
      </EditButton>
      {isDropdownVisible && (
        <DropdownContainer>
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              onPress={() => {
                option.onPress();
                setDropdownVisible(false);
              }}>
              <CustomText>{option.label}</CustomText>
            </DropdownItem>
          ))}
        </DropdownContainer>
      )}
    </Container>
  );
};

export default ChoiceDropdownModal;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DropdownContainer = styled.View`
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: ${colors.WHITE};
  border: 1px solid ${colors.GRAY_200};
  border-radius: 8px;
  shadow-color: ${colors.BLACK};
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 5;
  padding-vertical: 5px;
`;

const DropdownItem = styled.TouchableOpacity`
  padding: 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_200};
  align-items: center;
`;

const EditButton = styled.TouchableOpacity`
  margin-right: 16px;
`;

const EditButtonText = styled(CustomText)`
  color: ${colors.GRAY_700};
`;
