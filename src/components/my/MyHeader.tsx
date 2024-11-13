import React from 'react';
import { TouchableOpacity } from 'react-native';
import HeaderText from '../common/HeaderText';
import { LeftIcon } from '@/assets/icons';
import styled from 'styled-components/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';

const MyHeader = ({
  title,
  onPressBack,
}: {
  title: string;
  onPressBack?: () => void;
}) => {
  const navigation = useNavigation<NavigationProp<MyStackParamList>>();

  const handlePressBack = () => {
    if (onPressBack) onPressBack();
    navigation.goBack();
  };
  return (
    <StyledHeader>
      <TouchableOpacity
        onPress={handlePressBack}
        style={{ position: 'absolute', left: 5 }}>
        <LeftIcon />
      </TouchableOpacity>
      <HeaderText>{title}</HeaderText>
    </StyledHeader>
  );
};

export default MyHeader;

const StyledHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 70px;
`;
