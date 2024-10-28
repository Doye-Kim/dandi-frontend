import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {}

const CustomText = ({ style, ...rest }: CustomTextProps) => {
  const customStyle = {
    fontFamily: 'OAGothic-Medium',
  };
  return <Text style={[customStyle, style]} {...rest} />;
};

export default CustomText;
