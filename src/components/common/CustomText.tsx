import { colors } from '@/constants';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {}

const CustomText = ({ style, ...rest }: CustomTextProps) => {
  const customStyle = {
    fontFamily: 'OAGothic-Medium',
    color: colors.GRAY_900,
  };
  return <Text style={[customStyle, style]} {...rest} />;
};

export default CustomText;
