import { useRef } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { authNavigations, colors } from '@/constants';
import { responsive, validateName } from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import useForm from '@/hooks/useForm';
import AuthButton from '@/components/auth/AuthButton';
import InputField from '@/components/auth/InputField';
import { TitleText } from '@/styles';
import useAuthStore from '@/store/useAuthStore';
import { join } from '@/api/auth';

const AuthNameScreen = ({ navigation }: AuthHomeScreenProps) => {
  const { email, password, nickname, setNickname } = useAuthStore();
  const nameRef = useRef<TextInput | null>(null);
  const checkName = useForm({
    initialValue: { name: nickname },
    validate: validateName,
  });

  const handleJoin = async () => {
    const userData = {
      email,
      password,
      nickname: checkName.getTextInputProps('name').value,
    };
    console.log(userData);
    try {
      const { data } = await join(userData);
      console.log(data);
      navigation.navigate(authNavigations.EMAIL_CHECK);
    } catch (err) {
      console.log(err);
    }
  };
  const onPress = () => {
    setNickname(checkName.getTextInputProps('name').value);
    handleJoin();
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: responsive(10) }}>
      <View style={{ alignItems: 'center' }}>
        <ProgressBar
          progress={0.75}
          color={colors.GRAY_700}
          style={{
            backgroundColor: colors.GRAY_300,
            height: 2,
            width: responsive(352),
          }}
        />
      </View>
      <TitleText>사용하실 닉네임을{'\n'}입력해 주세요</TitleText>
      <InputField
        ref={nameRef}
        placeholder='닉네임을 입력해주세요'
        error={checkName.errors.name}
        touched={checkName.touched.name}
        returnKeyType='join'
        blurOnSubmit={false}
        keyboardType='email-address'
        {...checkName.getTextInputProps('name')}
      />
      <AuthButton
        title='다음'
        onPress={onPress}
        style={checkName.errors.name ? 'disable' : 'enable'}
      />
    </SafeAreaView>
  );
};

export default AuthNameScreen;
