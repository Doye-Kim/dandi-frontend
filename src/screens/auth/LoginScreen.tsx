import { useCallback, useRef } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {
  responsive,
  showErrorToast,
  validateEmail,
  validatePassword,
} from '@/utils';
import InputField from '@/components/auth/InputField';
import AuthButton from '@/components/auth/AuthButton';
import useForm from '@/hooks/useForm';
import useUserStore from '@/store/useUserStore';
import { getUserInfo, login } from '@/api/auth';
import { setEncryptStorage } from '@/utils/encryptedStorage';
import useBagStore from '@/store/useBagStore';

const LoginScreen = () => {
  const { setIsLogin } = useUserStore();

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const checkEmail = useForm({
    initialValue: { email: '' },
    validate: validateEmail,
  });
  const checkPassword = useForm({
    initialValue: { password: '' },
    validate: validatePassword,
  });

  const getFcmToken = useCallback(async () => {
    const data = await messaging().getToken();
    console.log('fcm', data);
    return data;
  }, []);

  interface ErrorResponse {
    message: string;
  }
  const { setDefaultBagId } = useBagStore();

  const handleLogin = async () => {
    const userData = {
      email: checkEmail.getTextInputProps('email').value,
      password: checkPassword.getTextInputProps('password').value,
    };
    const fcmCode = await getFcmToken();
    try {
      await login(userData, fcmCode);
      Toast.show({
        type: 'success',
        text1: '로그인 성공!',
      });
      await getUserData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
    }
  };

  const getUserData = async () => {
    try {
      const data = await getUserInfo();
      setDefaultBagId(data.bagId);
      await setEncryptStorage('user', data);
      setIsLogin(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressLogin = () => {
    handleLogin();
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: responsive(10) }}>
      <InputField
        ref={emailRef}
        placeholder='이메일을 입력해주세요'
        error={checkEmail.errors.email}
        touched={checkEmail.touched.email}
        returnKeyType='join'
        blurOnSubmit={false}
        keyboardType='email-address'
        onSubmitEditing={() => passwordRef.current?.focus()}
        {...checkEmail.getTextInputProps('email')}
      />
      <InputField
        ref={passwordRef}
        placeholder='비밀번호를 입력해 주세요'
        error={checkPassword.errors.password}
        touched={checkPassword.touched.password}
        secureTextEntry={true}
        returnKeyType='next'
        blurOnSubmit={false}
        onSubmitEditing={() => {
          if (!checkEmail.errors.email && !checkPassword.errors.password) {
            onPressLogin();
          }
        }}
        {...checkPassword.getTextInputProps('password')}
      />
      <AuthButton
        title='다음'
        onPress={onPressLogin}
        style={
          checkEmail.errors.email || checkPassword.errors.password
            ? 'disable'
            : 'enable'
        }
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
