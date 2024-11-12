import { useCallback, useRef } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {
  responsive,
  responsiveVertical,
  showErrorToast,
  validateEmail,
  validatePassword,
} from '@/utils';
import InputField from '@/components/auth/InputField';
import AuthButton from '@/components/auth/AuthButton';
import useForm from '@/hooks/useForm';
import useUserStore from '@/store/useUserStore';
import { getUserInfo, login } from '@/api/auth';
import useBagStore from '@/store/useBagStore';
import CustomText from '@/components/common/CustomText';
import { authNavigations, colors } from '@/constants';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import styled from 'styled-components/native';

const LoginScreen = ({ navigation }: AuthHomeScreenProps) => {
  const { setIsLogin, setNickname, setEmail } = useUserStore();

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

  const { setDefaultBagId } = useBagStore();

  const handleLogin = async () => {
    const userData = {
      email: checkEmail.getTextInputProps('email').value,
      password: checkPassword.getTextInputProps('password').value,
    };
    const fcmCode = await getFcmToken();
    try {
      await login(userData, fcmCode);
      await getUserData();
      setIsLogin(true);
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
      setNickname(data.nickname);
      setEmail(data.email);
      setIsLogin(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onPressLogin = () => {
    handleLogin();
  };

  const handleFindPassword = () => {
    navigation.navigate(authNavigations.EMAIL_VERIFY);
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
      <StyledFindPasswordContainer onPress={handleFindPassword}>
        <CustomText
          style={{ color: colors.GRAY_600, textDecorationLine: 'underline' }}>
          비밀번호 찾기
        </CustomText>
      </StyledFindPasswordContainer>
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

const StyledFindPasswordContainer = styled.TouchableOpacity`
  width: ${responsive(332)}px;
  height: ${responsiveVertical(30)}px;
  justify-content: center;
  align-items: flex-end;
`;
