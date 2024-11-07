// ListItem.tsx
import React from 'react';
import styled from 'styled-components/native';
import CustomText from '@/components/common/CustomText';
import Toggle from './Toggle';

const ToggleItem = ({
  label,
  onToggle,
  isOn,
  ...props
}: {
  label: string;
  onToggle: () => void;
  isOn: boolean;
}) => (
  <StyledListItem {...props}>
    <ContentText>{label}</ContentText>
    <Toggle onToggle={onToggle} isOn={isOn} />
  </StyledListItem>
);

export default ToggleItem;

const StyledListItem = styled.TouchableOpacity`
  padding: 10px;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContentText = styled(CustomText)`
  font-size: 16px;
`;
