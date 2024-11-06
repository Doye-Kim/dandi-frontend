// BagThings.tsx
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { DraggableGrid } from 'react-native-draggable-grid';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import useBagStore from '@/store/useBagStore';
import DeleteButton from './DeleteButton';
import CustomText from '../common/CustomText';

const data = [
  {
    itemId: 1,
    itemOrder: 3,
    name: '지갑',
    emoticon: '💼',
    colorKey: 1,
    createdAt: '2024-10-20T10:00:00',
    updatedAt: '2024-10-22T08:00:00',
  },
  {
    itemId: 2,
    itemOrder: 1,
    name: '여권',
    emoticon: '🛂',
    colorKey: 2,
    createdAt: '2024-10-20T11:00:00',
    updatedAt: '2024-10-22T08:30:00',
  },
  {
    itemId: 3,
    itemOrder: 4,
    name: '책',
    emoticon: '📖',
    colorKey: 3,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 4,
    itemOrder: 2,
    name: '책2',
    emoticon: '📖',
    colorKey: 4,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 5,
    itemOrder: 5,
    name: '일이삼사오육칠팔구십',
    emoticon: '📖',
    colorKey: 5,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 6,
    itemOrder: 6,
    name: '일이삼사오육칠팔구십',
    emoticon: '📖',
    colorKey: 6,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
];
export interface BagThingItem {
  itemId: number;
  itemOrder: number;
  name: string;
  emoticon: string;
  colorKey: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BagThingItemKey extends BagThingItem {
  key: string;
  disabledDrag: boolean;
}

const BagThings = () => {
  const editMode = useBagStore((state) => state.editMode);
  const [bagItems, setBagItems] = useState<BagThingItemKey[]>(
    data
      .sort((a, b) => a.itemOrder - b.itemOrder)
      .map((item) => ({
        ...item,
        key: `bag-${item.itemId}`,
        disabledDrag: !editMode,
      })),
  );

  useEffect(() => {
    setBagItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        disabledDrag: !editMode,
      })),
    );
  }, [editMode]);

  const handleLongPress = () => {
    console.log('longggg');
  };

  const onPressDelete = () => {
    console.log('delete');
  };
  const renderItem = (item: BagThingItemKey) => {
    const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];

    return !item.disabledDrag ? (
      <StyleView>
        {editMode && <DeleteButton onPressDelete={onPressDelete} />}
        <StyleItemIcon color={color}>
          <Text style={{ fontSize: 28 }}>{item.emoticon}</Text>
        </StyleItemIcon>
        <CustomText
          style={{
            marginTop: 2,
            height: 28,
            fontSize: item.name.length > 4 ? 11 : 14,
          }}>
          {item.name}
        </CustomText>
      </StyleView>
    ) : (
      <StyleTouchable onLongPress={handleLongPress}>
        <StyleView>
          {editMode && <DeleteButton onPressDelete={onPressDelete} />}
          <StyleItemIcon color={color}>
            <Text style={{ fontSize: 28 }}>{item.emoticon}</Text>
          </StyleItemIcon>
          <CustomText
            style={{
              marginTop: 2,
              height: 28,
              fontSize: item.name.length > 4 ? 11 : 14,
            }}>
            {item.name}
          </CustomText>
        </StyleView>
      </StyleTouchable>
    );
  };

  return (
    <View>
      <DraggableGrid
        numColumns={5}
        renderItem={renderItem}
        data={bagItems}
        itemHeight={100}
        onDragRelease={(updatedData) => {
          setBagItems(updatedData);
        }}
      />
    </View>
  );
};

export default BagThings;

const StyleItemIcon = styled.View<{ color: string }>`
  border-radius: 20px;
  background-color: ${colors.WHITE};
  padding: 5px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ color }) => color};
`;

const StyleView = styled.View`
  justify-content: center;
  align-items: center;
  width: ${responsive(352 / 5)}px;
  padding-horizontal: 3px;
`;

const StyleTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: ${responsive(352 / 5)}px;
  padding-horizontal: 3px;
`;
