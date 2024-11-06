// BagThing.tsx
import { useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { BagThingItem, BagThingItemKey } from './BagThings';
import { responsive } from '@/utils';
import CustomText from '../common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from './DeleteButton';

const BagThing = ({
  item,
  drag,
  onLongPress,
}: {
  item: BagThingItem | BagThingItemKey;
  drag?: () => void;
  onLongPress?: () => void;
}) => {
  const editMode = useBagStore((state) => state.editMode);
  const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];
  const onPressDelete = () => {
    console.log('delete', item.itemId);
  };

  const [isOpenActionModal, setIsOpenACtionModal] = useState(false);
  const handleLongPress = () => {
    if (editMode && drag) drag();
    if (onLongPress) onLongPress();
  };
  return (
    <StyleView>
      {editMode && <DeleteButton onPressDelete={onPressDelete} />}
      <StyleItemIcon color={color} onLongPress={drag && handleLongPress}>
        <Text style={{ fontSize: 28 }}>{item.emoticon}</Text>
      </StyleItemIcon>
      <View style={{ marginTop: 5, height: 28, justifyContent: 'center' }}>
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
  width: ${responsive(352 / 5)}px;
  padding-horizontal: 3px;
`;

const StyleItemIcon = styled.TouchableOpacity<{ color: string }>`
  border-radius: 20px;
  background-color: ${colors.WHITE};
  padding: 5px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ color }) => color};
`;
