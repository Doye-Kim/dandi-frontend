import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const NotiMainScreen = () => {
  return (
    <SafeAreaView>
      <CustomText style={{color: colors.BLACK}}>NotiMainScreen</CustomText>
    </SafeAreaView>
  );
};
export default NotiMainScreen;
