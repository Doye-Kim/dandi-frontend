import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Animated, Easing } from 'react-native';
import { colors } from '@/constants';

type Props = {
  onToggle: () => void;
  isOn: boolean;
};

const Toggle = ({ onToggle, isOn }: Props) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 28],
  });

  const onPress = () => {
    onToggle();
  };

  const color = isOn ? colors.PRIMARY : colors.GRAY_400;

  return (
    <ToggleContainer onPress={onPress} color={color}>
      <ToggleWheel
        style={{
          transform: [{ translateX }],
        }}
      />
    </ToggleContainer>
  );
};

export default Toggle;

const ToggleContainer = styled.TouchableOpacity<{ color: string }>`
  width: 55px;
  height: 30px;
  border-radius: 20px;
  justify-content: center;
  background-color: ${(props) => props.color};
`;

const ToggleWheel = styled(Animated.View)`
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 99px;
`;
