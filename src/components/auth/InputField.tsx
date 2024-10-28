import React, { ForwardedRef, forwardRef, useRef } from 'react';
import { TextInput, TextInputProps, Pressable } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { mergeRefs } from '@/utils';
import CustomText from '../common/CustomText';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    { disabled = false, error, touched, ...props }: InputFieldProps,
    ref?: ForwardedRef<TextInput>,
  ) => {
    const innerRef = useRef<TextInput | null>(null);
    const handlePressInput = () => {
      innerRef.current?.focus();
    };
    return (
      <Pressable onPress={handlePressInput} style={{ marginBottom: 10 }}>
        <StyleInputContainer error={touched && Boolean(error)}>
          <StyleInput
            editable={!disabled}
            placeholderTextColor={colors.GRAY_500}
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect={false}
            ref={ref ? mergeRefs(innerRef, ref) : innerRef}
            {...props}
          />
        </StyleInputContainer>
        {touched && Boolean(error) && <ErrorText>{error}</ErrorText>}
      </Pressable>
    );
  },
);

const StyleInputContainer = styled.View<{ error?: boolean }>`
  width: ${responsive(352)}px;
  height: 60px;
  justify-content: center;
  padding: ${responsive(5)}px;
  border-radius: ${responsive(20)}px;
  background-color: ${colors.WHITE};
  border-color: ${({ error }) => (error ? colors.ERROR : colors.GRAY_500)};
  border-width: 1px;
`;
const StyleInput = styled.TextInput<TextInputProps>`
  font-family: OAGothic-Medium;
  font-size: ${responsive(15)}px;
`;
const ErrorText = styled(CustomText)`
  font-size: ${responsive(13)}px;
  color: ${colors.ERROR};
`;

export default InputField;
