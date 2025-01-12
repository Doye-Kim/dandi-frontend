import { useRef } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { authNavigations, colors } from '@/constants';
import { responsive, validatePassword, validatePasswordConfirm } from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import AuthButton from '@/components/auth/AuthButton';
import InputField from '@/components/auth/InputField';
import useForm from '@/hooks/useForm';
import { TitleText } from '@/styles';
import useAuthStore from '@/store/useAuthStore';

const AuthPasswordScreen = ({ navigation }: AuthHomeScreenProps) => {
  const password = useAuthStore((state) => state.password);
  const { setPassword } = useAuthStore();
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);

  const checkPassword = useForm({
    initialValue: { password: password },
    validate: validatePassword,
  });

  const checkPasswordConfirm = useForm({
    initialValue: {
      password: checkPassword.values.password,
      passwordConfirm: password,
    },
    validate: validatePasswordConfirm,
  });

  const onPress = () => {
    setPassword(checkPasswordConfirm.getTextInputProps('password').value);
    navigation.navigate(authNavigations.AUTH_NAME);
  };

  return (
    <SafeAreaView style={{ marginHorizontal: responsive(10) }}>
      <View style={{ alignItems: 'center' }}>
        <ProgressBar
          progress={0.5}
          color={colors.GRAY_700}
          style={{
            backgroundColor: colors.GRAY_300,
            height: 2,
            width: responsive(352),
          }}
        />
      </View>
      <TitleText>로그인에 사용할 비밀번호를 {'\n'}입력해 주세요</TitleText>
      <InputField
        ref={passwordRef}
        placeholder='비밀번호를 입력해 주세요'
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
        blurOnSubmit={true}
        onSubmitEditing={() => {
          if (
            !checkPasswordConfirm.errors.passwordConfirm &&
            !checkPasswordConfirm.errors.password
          ) {
            onPress();
          }
        }}
        {...checkPasswordConfirm.getTextInputProps('passwordConfirm')}
      />
      <AuthButton
        title='다음'
        onPress={onPress}
        style={
          checkPasswordConfirm.errors.passwordConfirm ||
          checkPasswordConfirm.errors.password
            ? 'disable'
            : 'enable'
        }
      />
    </SafeAreaView>
  );
};

export default AuthPasswordScreen;
