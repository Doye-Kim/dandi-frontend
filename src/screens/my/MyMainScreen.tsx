import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const MyMainScreen = () => {
  return (
    <SafeAreaView>
      <CustomText style={{color: colors.BLACK}}>MyMainScreen</CustomText>
    </SafeAreaView>
  );
};
export default MyMainScreen;
