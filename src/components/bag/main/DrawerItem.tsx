import { TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants';
import CustomText from '../../common/CustomText';
import DeleteButton from '../DeleteButton';
import useBagStore from '@/store/useBagStore';
import { ItemProps } from '@/api/bag';

const DrawerItem = ({ item }: { item: ItemProps }) => {
  const editMode = useBagStore((state) => state.editMode);
  const { setEditMode } = useBagStore();
  const backColor =
    colors[`THINGS_BACK_${item.colorKey}` as keyof typeof colors];
  const textColor =
    colors[`THINGS_TEXT_${item.colorKey}` as keyof typeof colors];

  const onPressDelete = () => {
    console.log('delete');
  };

  const onLongPress = () => {
    if (!editMode) setEditMode(true);
    // #todo: 편집 모드일 땐 드래그
  };
  return (
    <View>
      {editMode && <DeleteButton onPressDelete={onPressDelete} />}
      <TouchableOpacity
        key={item.itemId}
        onLongPress={onLongPress}
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