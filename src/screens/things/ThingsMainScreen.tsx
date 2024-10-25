import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const ThingsMainScreen = () => {
  return (
    <SafeAreaView>
      <CustomText style={{color: colors.BLACK}}>ThingsMainScreen</CustomText>
    </SafeAreaView>
  );
};
export default ThingsMainScreen;
