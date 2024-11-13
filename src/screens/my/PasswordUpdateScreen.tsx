import { useRef } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { myNavigations } from '@/constants';
import {
  validatePastPassword,
  validatePassword,
  validatePasswordUpdate,
  showToast,
  checkErrorAndViewToast,
} from '@/utils';
import AuthButton from '@/components/auth/AuthButton';
import InputField from '@/components/auth/InputField';
import MyHeader from '@/components/my/MyHeader';
import { MyScreenProps } from './MyMainScreen';
import { putUpdatePassword } from '@/api/auth';
import useForm from '@/hooks/useForm';

const PasswordUpdateScreen = ({ navigation }: MyScreenProps) => {
  const pastPasswordRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);

  const checkPastPassword = useForm({
    initialValue: { pastPassword: '' },
    validate: validatePastPassword,
  });

  const checkPassword = useForm({
    initialValue: { password: '' },
    validate: validatePassword,
  });

  const checkPasswordConfirm = useForm({
    initialValue: {
      pastPassword: checkPastPassword.values.pastPassword,
      password: checkPassword.values.password,
      passwordConfirm: '',
    },
    validate: validatePasswordUpdate,
  });

  const putPassword = async () => {
    try {
      await putUpdatePassword({
        pastPassword: checkPastPassword.values.pastPassword,
        newPassword: checkPasswordConfirm.values.password,
      });
      navigation.navigate(myNavigations.MY_MAIN);
      showToast('비밀번호 변경 완료');
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  const handlePress = () => {
    putPassword();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MyHeader title={'비밀번호 변경'} />
      <View style={{ alignItems: 'center' }}>
        <InputField
          ref={pastPasswordRef}
          placeholder='현재 비밀번호 입력'
          error={checkPastPassword.errors.password}
          touched={checkPastPassword.touched.password}
          secureTextEntry={true}
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          {...checkPastPassword.getTextInputProps('pastPassword')}
        />
        <InputField
          ref={passwordRef}
          placeholder='새 비밀번호 입력'
          error={checkPasswordConfirm.errors.password}
          touched={checkPasswordConfirm.touched.password}
          secureTextEntry={true}
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
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
export default PasswordUpdateScreen;
