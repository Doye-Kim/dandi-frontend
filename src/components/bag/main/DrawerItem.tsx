import { TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants';
import { ItemProps } from '@/api/bag';
import CustomText from '../../common/CustomText';

const DrawerItem = ({ item }: { item: ItemProps }) => {
  const backColor =
    colors[`THINGS_BACK_${item.colorKey}` as keyof typeof colors];
  const textColor =
    colors[`THINGS_TEXT_${item.colorKey}` as keyof typeof colors];

  return (
    <View>
      <TouchableOpacity
        key={item.itemId}
        style={{
          backgroundColor: backColor,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 15,
          margin: 5,
        }}>
        <CustomText style={{ color: textColor }}>{item.name}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerItem;
