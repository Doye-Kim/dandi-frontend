import { useRef } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import axios from 'axios';
import { authNavigations } from '@/constants';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import { postPasswordWithVerification } from '@/api/auth';
import {
  validatePassword,
  validatePasswordConfirm,
  showToast,
  checkErrorAndViewToast,
} from '@/utils';
import AuthButton from '@/components/auth/AuthButton';
import InputField from '@/components/auth/InputField';
import useAuthStore from '@/store/useAuthStore';
import useForm from '@/hooks/useForm';

const AuthPasswordUpdateScreen = ({ navigation }: AuthHomeScreenProps) => {
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);
  const verificationNumber = useAuthStore((state) => state.verificationNumber);
  const email = useAuthStore((state) => state.email);

  const checkPassword = useForm({
    initialValue: { password: '' },
    validate: validatePassword,
  });

  const checkPasswordConfirm = useForm({
    initialValue: {
      password: checkPassword.values.password,
      passwordConfirm: '',
    },
    validate: validatePasswordConfirm,
  });

  const confirmPassword = async (password: string) => {
    console.log({ verificationNumber, email, newPassword: password });
    try {
      const data = await postPasswordWithVerification({
        verificationNumber,
        email,
        newPassword: password,
      });
      navigation.navigate(authNavigations.LOGIN);
      showToast('비밀번호가 변경되었습니다.');
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  const handlePress = () => {
    const passwordValue = checkPasswordConfirm.values.password;
    confirmPassword(passwordValue);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <InputField
          ref={passwordRef}
          placeholder='새 비밀번호 입력'
          error={checkPasswordConfirm.errors.password}
          touched={checkPasswordConfirm.touched.password}
          secureTextEntry={true}
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          {...checkPasswordConfirm.getTextInputProps('password')}
        />
        <InputField
          ref={passwordConfirmRef}
          placeholder='비밀번호를 한 번 더 입력해 주세요'
          error={checkPasswordConfirm.errors.passwordConfirm}
          touched={checkPasswordConfirm.touched.passwordConfirm}
          secureTextEntry={true}
          returnKeyType='join'
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (
              !checkPasswordConfirm.errors.passwordConfirm &&
              !checkPasswordConfirm.errors.password
            ) {
              handlePress();
            }
          }}
          {...checkPasswordConfirm.getTextInputProps('passwordConfirm')}
        />
        <AuthButton
          title='확인'
          onPress={handlePress}
          style={
            checkPasswordConfirm.errors.passwordConfirm ||
            checkPasswordConfirm.errors.password
              ? 'disable'
              : 'enable'
          }
        />
      </View>
    </SafeAreaView>
  );
};
export default AuthPasswordUpdateScreen;
