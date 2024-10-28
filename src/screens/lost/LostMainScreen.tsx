import CustomText from '@/components/common/CustomText';
import { colors } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const LostMainScreen = () => {
  return (
    <SafeAreaView>
      <CustomText style={{ color: colors.BLACK }}>lost main</CustomText>
    </SafeAreaView>
  );
};
export default LostMainScreen;
