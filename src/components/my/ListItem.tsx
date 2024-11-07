// ListItem.tsx
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import CustomText from '@/components/common/CustomText';
import { RightIcon } from '@/assets/icons';

interface ListItemProps extends TouchableOpacityProps {
  label: string;
  rightText?: string;
  showIcon?: boolean;
}

const ListItem = ({ label, rightText, showIcon, ...props }: ListItemProps) => (
  <StyledListItem {...props}>
    <ContentText>{label}</ContentText>
    {rightText && <ContentText>{rightText}</ContentText>}
    {showIcon && <RightIcon />}
  </StyledListItem>
);

export default ListItem;

const StyledListItem = styled.TouchableOpacity`
  padding: 10px;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContentText = styled(CustomText)`
  font-size: 15px;
`;
