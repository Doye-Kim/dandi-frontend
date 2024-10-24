import React from 'react';
import {Text, TextProps} from 'react-native';

interface CustomTextProps extends TextProps {}

const CustomText: React.FC<CustomTextProps> = ({style, ...rest}) => {
  const customStyle = {
    fontFamily: 'OAGothic-Medium',
  };
  return <Text style={[customStyle, style]} {...rest} />;
};

export default CustomText;
