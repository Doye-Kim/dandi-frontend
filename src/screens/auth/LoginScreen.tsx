import { useRef } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import { responsive, validateEmail, validatePassword } from '@/utils';
import InputField from '@/components/auth/InputField';
import AuthButton from '@/components/auth/AuthButton';
import useForm from '@/hooks/useForm';
import useUserStore from '@/store/useUserStore';

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

  const onPressLogin = () => {
    setIsLogin(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: responsive(10) }}>
      <InputField
        ref={emailRef}
        placeholder="이메일을 입력해주세요"
        error={checkEmail.errors.email}
        touched={checkEmail.touched.email}
        returnKeyType="join"
        blurOnSubmit={false}
        keyboardType="email-address"
        onSubmitEditing={() => passwordRef.current?.focus()}
        {...checkEmail.getTextInputProps('email')}
      />
      <InputField
        ref={passwordRef}
        placeholder="비밀번호를 입력해 주세요"
        error={checkPassword.errors.password}
        touched={checkPassword.touched.password}
        secureTextEntry={true}
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          if (!checkEmail.errors.email && !checkPassword.errors.password) {
            onPressLogin();
          }
        }}
        {...checkPassword.getTextInputProps('password')}
      />
      <AuthButton
        title="다음"
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
