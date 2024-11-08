import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import DraggableGrid from 'react-native-draggable-grid';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { CheckIcon } from '@/assets/icons';
import { ItemKeyProps, StyleItemIcon } from './BagThings';
import { getDrawerItems } from '@/api/bag';
import CustomText from '../common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from './DeleteButton';

const BagDrawer = () => {
  const editMode = useBagStore((state) => state.editMode);
  const { addMultipleItems } = useBagStore();
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);
  const [drawerItems, setDrawerItems] = useState<ItemKeyProps[]>([]);
  const [selectItems, setSelectItems] = useState<ItemKeyProps[]>([]);

  const getDrawerItemList = async () => {
    try {
      const data = await getDrawerItems(
        selectBagId === -1 ? defaultBagId : selectBagId,
      );
      setDrawerItems(
        data
          .sort((a, b) => a.itemOrder - b.itemOrder)
          .map((item) => ({
            ...item,
            key: `bag-${item.itemId}`,
            disabledDrag: !editMode,
          })),
      );
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: axios.isAxiosError(err)
          ? err.message
          : '서랍 소지품을 불러오는 데 문제가 생겼어요. 다시 시도해 주세요',
      });
    }
  };
  useEffect(() => {
    getDrawerItemList();
  }, []);

  useEffect(() => {
    setDrawerItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        disabledDrag: !editMode,
      })),
    );
  }, [editMode]);

  const handlePress = (item: ItemKeyProps) => {
    setSelectItems((prevItems: ItemKeyProps[]) => {
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

  const renderItem = (item: ItemKeyProps) => {
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
