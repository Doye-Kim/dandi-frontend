import { SafeAreaView } from 'react-native';
import { CheckRingIcon } from '@/assets/icons';
import { authNavigations, colors } from '@/constants';
import { responsive } from '@/utils';
import { AuthHomeScreenProps } from './AuthHomeScreen';
import CustomText from '@/components/common/CustomText';
import AuthButton from '@/components/auth/AuthButton';

const EmailCheckScreen = ({ navigation }: AuthHomeScreenProps) => {
  const onPress = () => {
    navigation.navigate(authNavigations.AUTH_PHONE);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
      }}
    >
      <CheckRingIcon />
      <CustomText
        style={{
          color: colors.GRAY_900,
          fontSize: responsive(18),
          marginVertical: responsive(20),
          marginHorizontal: responsive(20),
        }}
      >
        인증 메일을 보냈습니다. 메일함을 확인 후 인증 완료 버튼을 눌러 주세요
      </CustomText>
      <AuthButton title="인증 완료" onPress={onPress} style="enable" />
    </SafeAreaView>
  );
};

export default EmailCheckScreen;
