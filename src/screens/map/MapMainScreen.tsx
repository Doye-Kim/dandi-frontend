import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const MapMainScreen = () => {
  return (
    <SafeAreaView>
      <CustomText style={{color: colors.BLACK}}>MapMainScreen</CustomText>
    </SafeAreaView>
  );
};
export default MapMainScreen;
