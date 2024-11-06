import { colors } from '@/constants';
import { TouchableOpacity, View } from 'react-native';
import CustomText from '../common/CustomText';
import DeleteButton from './DeleteButton';
import useBagStore from '@/store/useBagStore';

export interface BagDrawerItem {
  id: number;
  itemOrder: number;
  emoticon: string;
  name: string;
  colorKey: number;
  created_at: string;
}
const DrawerItem = ({ item }: { item: BagDrawerItem }) => {
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
        key={item.id}
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
