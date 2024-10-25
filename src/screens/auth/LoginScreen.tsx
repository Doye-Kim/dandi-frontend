import { SafeAreaView } from 'react-native';
import { colors } from '@/constants';
import CustomText from '@/components/common/CustomText';

const LoginScreen = () => {
  return (
    <SafeAreaView>
      <CustomText style={{ color: colors.BLACK }}>LoginScreen</CustomText>
    </SafeAreaView>
  );
};

export default LoginScreen;
