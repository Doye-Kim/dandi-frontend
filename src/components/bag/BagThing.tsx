import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { BagThingItem } from './BagThings';
import { DeleteBagIcon } from '@/assets/icons';
import CustomText from '../common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from './DeleteButton';
import { responsive } from '@/utils';

const BagThing = ({ item }: { item: BagThingItem }) => {
  const mode = useBagStore((state) => state.mode);
  const { setMode } = useBagStore();
  const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];
  const onPressDelete = () => {
    console.log('delete', item.itemId);
  };

  const onLongPress = () => {
    if (mode !== 2) setMode(2);
    // #todo: 편집 모드일 땐 드래그
  };
  return (
    <StyleView>
      {mode === 2 && <DeleteButton onPressDelete={onPressDelete} />}
      <StyleItemIcon onLongPress={onLongPress} color={color}>
        <Text style={{ fontSize: 28 }}>{item.emoticon}</Text>
      </StyleItemIcon>
      <View style={{ marginTop: 5, height: 28 }}>
        <CustomText
          style={{
            fontSize: item.name.length > 4 ? 11 : 14,
          }}>
          {item.name}
        </CustomText>
      </View>
    </StyleView>
  );
};
export default BagThing;

const StyleView = styled.View`
  justify-content: center;
  align-items: center;
  width: ${responsive(74)}px;
  padding-horizontal: 3px;
  margin-top: 3px;
`;

const StyleItemIcon = styled.TouchableOpacity<{ color: string }>`
  border-radius: 20px;
  background-color: ${colors.WHITE};
  padding: 5px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ color }) => color};
`;