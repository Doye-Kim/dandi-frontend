import { useRef, useState } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import {
  checkErrorAndViewToast,
  responsive,
  showCustomErrorToast,
  validateEmail,
} from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import { putPasswordVerifyNum } from '@/api/auth';
import { authNavigations } from '@/constants';
import InputField from '@/components/auth/InputField';
import useForm from '@/hooks/useForm';
import AuthButton from '@/components/auth/AuthButton';
import useAuthStore from '@/store/useAuthStore';

const EmailVerifyScreen = ({ navigation }: AuthHomeScreenProps) => {
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [number, setNumber] = useState<string>('');
  const { setVerificationNumber, setEmail } = useAuthStore();

  const sendEmail = async () => {
    try {
      const data = putPasswordVerifyNum(
        checkEmail.getTextInputProps('email').value,
      );
      setIsSendEmail(true);
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };
  const handlePressConfirm = () => {
    if (!isSendEmail) {
      sendEmail();
    } else {
      if (!number) showCustomErrorToast('인증 번호를 입력해 주세요');
      else {
        setEmail(checkEmail.getTextInputProps('email').value);
        setVerificationNumber(number);
        navigation.navigate(authNavigations.PASSWORD_UPDATE);
      }
    }
  };
  const checkEmail = useForm({
    initialValue: { email: '' },
    validate: validateEmail,
  });

  const emailRef = useRef<TextInput | null>(null);
  const numberRef = useRef<TextInput | null>(null);

  const handleChangeNumber = (text: string) => {
    setNumber(text);
  };
  return (
    <SafeAreaView style={{ flex: 1, margin: responsive(10) }}>
      <InputField
        ref={emailRef}
        placeholder='이메일을 입력해주세요'
        error={checkEmail.errors.email}
        touched={checkEmail.touched.email}
        returnKeyType='join'
        blurOnSubmit={false}
        keyboardType='email-address'
        onSubmitEditing={() => {
          if (!checkEmail.errors.email) {
            handlePressConfirm();
          }
        }}
        {...checkEmail.getTextInputProps('email')}
      />
      {isSendEmail && (
        <InputField
          ref={numberRef}
          placeholder='인증 번호를 입력해주세요'
          error={checkEmail.errors.email}
          touched={checkEmail.touched.email}
          returnKeyType='join'
          blurOnSubmit={false}
          keyboardType='email-address'
          onSubmitEditing={() => {
            if (!checkEmail.errors.email) {
              handlePressConfirm();
            }
          }}
          value={number}
          onChangeText={handleChangeNumber}
        />
      )}
      <AuthButton
        title={isSendEmail ? '다음' : '인증번호 받기'}
        onPress={handlePressConfirm}
        style={checkEmail.errors.email ? 'disable' : 'enable'}
      />
    </SafeAreaView>
  );
};

export default EmailVerifyScreen;
