import { useRef } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { authNavigations, colors } from '@/constants';
import { responsive, validatePhone, validatePhoneAuthNum } from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import AuthButton from '@/components/auth/AuthButton';
import InputField from '@/components/auth/InputField';
import CustomText from '@/components/common/CustomText';
import useForm from '@/hooks/useForm';

const AuthPhoneScreen = ({ navigation }: AuthHomeScreenProps) => {
  const phoneRef = useRef<TextInput | null>(null);
  const phoneAuthNumRef = useRef<TextInput | null>(null);

  const checkPhone = useForm({
    initialValue: { phone: '' },
    validate: validatePhone,
  });
  const checkPhoneAuthNum = useForm({
    initialValue: { phoneAuthNum: '' },
    validate: validatePhoneAuthNum,
  });

  const onPress = () => {
    Toast.show({
      type: 'success',
      text1: '가입 완료! 로그인을 진행해 주세요',
    });
    navigation.navigate(authNavigations.LOGIN);
  };

  return (
    <SafeAreaView style={{ marginHorizontal: responsive(10) }}>
      <View style={{ alignItems: 'center' }}>
        <ProgressBar
          progress={1}
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
        본인인증을 위해{'\n'}전화번호가 필요해요
      </CustomText>
      <InputField
        ref={phoneRef}
        placeholder="전화번호를 입력해 주세요"
        error={checkPhone.errors.phone}
        touched={checkPhone.touched.phone}
        returnKeyType="next"
        blurOnSubmit={false}
        inputMode="numeric"
        onSubmitEditing={() => phoneAuthNumRef.current?.focus()}
        {...checkPhone.getTextInputProps('phone')}
      />
      {!checkPhone.errors.phone && (
        <InputField
          ref={phoneAuthNumRef}
          placeholder="인증번호를 입력해 주세요"
          error={checkPhoneAuthNum.errors.phoneAuthNum}
          touched={checkPhoneAuthNum.touched.phoneAuthNum}
          inputMode="numeric"
          returnKeyType="join"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            if (!checkPhoneAuthNum.errors.phoneAuthNum) {
              onPress();
            }
          }}
          {...checkPhoneAuthNum.getTextInputProps('phoneAuthNum')}
        />
      )}
      <AuthButton
        title="완료"
        onPress={onPress}
        style={checkPhone.errors.phone ? 'disable' : 'enable'}
      />
    </SafeAreaView>
  );
};

export default AuthPhoneScreen;
