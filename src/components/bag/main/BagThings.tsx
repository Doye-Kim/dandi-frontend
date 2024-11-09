import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { ItemProps, getBagItems } from '@/api/bag';
import useBagStore from '@/store/useBagStore';
import DeleteButton from '../DeleteButton';
import CustomText from '../../common/CustomText';
import BagThing from './BagThing';

export interface ItemKeyProps extends ItemProps {
  key: string;
  disabledDrag: boolean;
}

const BagThings = () => {
  const editMode = useBagStore((state) => state.editMode);
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);
  const { updateDisabledDrag } = useBagStore();

  const [bagKeyItems, setBagKeyItems] = useState<ItemKeyProps[]>([]);

  const { data: bagItems, error } = useQuery<ItemProps[], Error>({
    queryKey: ['bagItems', selectBagId],
    queryFn: () => getBagItems(selectBagId === -1 ? defaultBagId : selectBagId),
    select: (data) => data.sort((a, b) => a.itemOrder - b.itemOrder),
  });

  const getBagItemList = async () => {
    if (bagItems) {
      setBagKeyItems(
        bagItems.map((item) => ({
          ...item,
          key: `bag-${item.itemId}`,
          disabledDrag: !editMode,
        })),
      );
    }
    if (error) {
      Toast.show({
        type: 'error',
        text1: axios.isAxiosError(error)
          ? error.message
          : '가방 소지품 목록을 불러오는 데 문제가 생겼어요.  다시 시도해 주세요',
      });
    }
  };

  useEffect(() => {
    getBagItemList();
  }, [bagItems, error]);

  useEffect(() => {
    updateDisabledDrag(!editMode);
  }, [editMode]);

  const onPressDelete = () => {
    console.log('delete');
  };

  const renderItem = (item: ItemKeyProps) => {
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
      <BagThing item={item} />
    );
  };

  return (
    <View>
      {bagKeyItems.length > 0 ? (
        <DraggableGrid
          numColumns={5}
          renderItem={renderItem}
          data={bagKeyItems}
          onDragRelease={(updatedData) => {
            setBagKeyItems(updatedData);
          }}
        />
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomText>현재 가방에 들어있는 소지품이 없어요</CustomText>
          <CustomText>서랍에서 꺼내오거나, 추가해 보세요!</CustomText>
        </View>
      )}
    </View>
  );
};

export default BagThings;

export const StyleItemIcon = styled.View<{ color: string }>`
  border-radius: 20px;
  background-color: ${colors.WHITE};
  padding: 5px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ color }) => color};
`;

export const StyleView = styled.View`
  justify-content: center;
  align-items: center;
  width: ${responsive(352 / 5)}px;
  padding-horizontal: 3px;
`;

export const StyleTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: ${responsive(352 / 5)}px;
  padding-horizontal: 3px;
`;
