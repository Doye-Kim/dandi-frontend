import { useRef } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { authNavigations, colors } from '@/constants';
import { responsive, validateEmail } from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import InputField from '@/components/auth/InputField';
import useForm from '@/hooks/useForm';
import AuthButton from '@/components/auth/AuthButton';
import CustomText from '@/components/common/CustomText';

const AuthEmailScreen = ({ navigation }: AuthHomeScreenProps) => {
  const onPress = () => {
    navigation.navigate(authNavigations.AUTH_PASSWORD);
  };
  const checkEmail = useForm({
    initialValue: { email: '' },
    validate: validateEmail,
  });

  const emailRef = useRef<TextInput | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: responsive(10) }}>
      <View style={{ alignItems: 'center' }}>
        <ProgressBar
          progress={0.25}
          color={colors.GRAY_700}
          style={{
            backgroundColor: colors.GRAY_300,
            height: 2,
            width: responsive(352),
          }}
        />
      </View>
      <CustomText
        style={{
          color: colors.BLACK,
          fontSize: responsive(24),
          marginVertical: responsive(20),
        }}
      >
        로그인에 사용할 이메일을 {'\n'}입력해 주세요
      </CustomText>
      <InputField
        ref={emailRef}
        placeholder="이메일을 입력해주세요"
        error={checkEmail.errors.email}
        touched={checkEmail.touched.email}
        returnKeyType="join"
        blurOnSubmit={false}
        keyboardType="email-address"
        onSubmitEditing={() => {
          if (!checkEmail.errors.email) {
            onPress();
          }
        }}
        {...checkEmail.getTextInputProps('email')}
      />
      <AuthButton
        title="다음"
        onPress={onPress}
        style={checkEmail.errors.email ? 'disable' : 'enable'}
      />
    </SafeAreaView>
  );
};

export default AuthEmailScreen;
