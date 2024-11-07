import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';
import DraggableGrid from 'react-native-draggable-grid';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { CheckIcon } from '@/assets/icons';
import { BagThingItem, BagThingItemKey, StyleItemIcon } from './BagThings';
import CustomText from '../common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from './DeleteButton';

const data: BagThingItem[] | [] = [
  {
    itemId: 10,
    itemOrder: 3,
    name: '지갑',
    emoticon: '💼',
    colorKey: 1,
    createdAt: '2024-10-20T10:00:00',
    updatedAt: '2024-10-22T08:00:00',
  },
  {
    itemId: 12,
    itemOrder: 1,
    name: '여권',
    emoticon: '🛂',
    colorKey: 2,
    createdAt: '2024-10-20T11:00:00',
    updatedAt: '2024-10-22T08:30:00',
  },
  {
    itemId: 13,
    itemOrder: 4,
    name: '책',
    emoticon: '📖',
    colorKey: 3,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 14,
    itemOrder: 2,
    name: '책2',
    emoticon: '📖',
    colorKey: 4,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 15,
    itemOrder: 5,
    name: '일이삼사오육칠팔구십',
    emoticon: '📖',
    colorKey: 5,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 16,
    itemOrder: 6,
    name: '일이삼사오육칠팔구십',
    emoticon: '📖',
    colorKey: 6,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 17,
    itemOrder: 6,
    name: '꺄륵',
    emoticon: '💼',
    colorKey: 6,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
];

const BagDrawer = () => {
  const editMode = useBagStore((state) => state.editMode);
  const { addMultipleItems } = useBagStore();
  const [drawerItems, setDrawerItems] = useState<BagThingItemKey[]>([]);
  const [selectItems, setSelectItems] = useState<BagThingItemKey[]>([]);
  // data가 있을 때만 한 번 초기화
  useEffect(() => {
    if (data && data.length > 0) {
      setDrawerItems(
        data
          .sort((a, b) => a.itemOrder - b.itemOrder)
          .map((item) => ({
            ...item,
            key: `bag-${item.itemId}`,
            disabledDrag: !editMode, // 초기화 시에는 editMode에 따라 설정
          })),
      );
    }
  }, [data]);

  useEffect(() => {
    setDrawerItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        disabledDrag: !editMode,
      })),
    );
  }, [editMode]);

  const handlePress = (item: BagThingItemKey) => {
    setSelectItems((prevItems: BagThingItemKey[]) => {
      const itemExists = prevItems.includes(item);

      if (itemExists) {
        return prevItems.filter((prev) => prev.itemId !== item.itemId);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const onPressDelete = () => {
    console.log('delete');
  };

  const handlePutBag = () => {
    setSelectItems((currentItems) => {
      const itemsToMove = [...currentItems];

      addMultipleItems(itemsToMove);
      console.log('itemsToMove', itemsToMove);

      setDrawerItems((prevItems) =>
        prevItems.filter((item) => !itemsToMove.includes(item)),
      );

      return [];
    });
  };

  const renderItem = (item: BagThingItemKey) => {
    const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];
    const isSelected = selectItems.includes(item);

    return !item.disabledDrag ? (
      <StyleView>
        {editMode && <DeleteButton onPressDelete={onPressDelete} />}
        <StyleItemIcon color={color}>
          <Text style={{ fontSize: 28 }}>{item.emoticon}</Text>
        </StyleItemIcon>
        <CustomText
          style={{
            fontSize: item.name.length > 4 ? 9 : 11,
          }}>
          {item.name}
        </CustomText>
      </StyleView>
    ) : (
      <StyleTouchable onPress={() => handlePress(item)}>
        {isSelected ? (
          <StyleSelectItemIcon>
            <Text style={{ fontSize: 28, position: 'absolute', opacity: 0.5 }}>
              {item.emoticon}
            </Text>
            <CheckIcon width={40} height={40} />
          </StyleSelectItemIcon>
        ) : (
          <StyleItemIcon color={color}>
            <Text style={{ fontSize: 28 }}>{item.emoticon}</Text>
          </StyleItemIcon>
        )}
        <CustomText
          style={{
            fontSize: item.name.length > 4 ? 9 : 11,
          }}>
          {item.name}
        </CustomText>
      </StyleTouchable>
    );
  };

  return (
    <StyleContainer>
      {drawerItems.length > 0 ? (
        <>
          <ScrollView>
            <DraggableGrid
              numColumns={4}
              style={{ margin: 20, flexWrap: 'wrap' }}
              renderItem={renderItem}
              data={drawerItems}
              onDragRelease={(updatedData) => {
                setDrawerItems(updatedData);
              }}
            />
          </ScrollView>
          {selectItems.length > 0 && (
            <StylePutBag onPress={handlePutBag}>
              <CustomText style={{ color: colors.WHITE, fontSize: 12 }}>
                가방에 넣기
              </CustomText>
            </StylePutBag>
          )}
        </>
      ) : (
        <StyleEmptyItemText>서랍에 보관된 소지품이 없어요</StyleEmptyItemText>
      )}
    </StyleContainer>
  );
};

export default BagDrawer;

const StyleEmptyItemText = styled(CustomText)`
  padding: 10px;
  font-size: 12px;
  text-align: center;
  color: ${colors.BEIGE_500};
`;
const StyleContainer = styled.View`
  width: ${responsive(320)}px;
  border-radius: 30px;
  position: absolute;
  right: 20px;
  bottom: 90px;
  background-color: ${colors.BEIGE_300};
  elevation: 8;
`;
const StyleView = styled.View`
  justify-content: center;
  align-items: center;
  width: ${responsive(280 / 4)}px;
  padding: 10px;
`;

const StyleTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: ${responsive(280 / 4)}px;
  padding: 10px;
`;

const StyleSelectItemIcon = styled.View`
  border-radius: 20px;
  background-color: 'rgba(139, 88, 67, 0.5)';
  width: 45px;
  height: 50px;
  // border-width: 2px;
  // border-style: dashed;
  border-color: ${colors.BEIGE_500};
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const StylePutBag = styled.TouchableOpacity`
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: ${colors.BEIGE_500};
  border-radius: 20px;
  padding: 5px;
  width: 100px;
`;
