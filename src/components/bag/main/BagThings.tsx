import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { checkErrorAndViewToast, responsive } from '@/utils';
import { ItemProps } from '@/api/bag';
import { BagScreenProps } from '@/screens/bag/BagMainScreen';
import {
  useBagItemQuery,
  useBagItemOrderMutation,
  useDeleteItemMutation,
} from '@/queries/bagQueries';
import CustomModal from '@/components/common/CustomModal';
import CustomText from '@/components/common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from '../DeleteButton';
import BagThing from './BagThing';

export interface ItemKeyProps extends ItemProps {
  key: string;
  disabledDrag: boolean;
}

const BagThings = ({ navigation }: BagScreenProps) => {
  const editMode = useBagStore((state) => state.editMode);
  const isEditComplete = useBagStore((state) => state.isEditComplete);
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);

  const [bagKeyItems, setBagKeyItems] = useState<ItemKeyProps[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const { data: bagItems, error } = useBagItemQuery(selectBagId, defaultBagId);

  useEffect(() => {
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
      checkErrorAndViewToast(error);
    }
  }, [bagItems, error]);

  useEffect(() => {
    if (bagItems) {
      setBagKeyItems(
        bagItems.map((item) => ({
          ...item,
          key: `bag-${item.itemId}`,
          disabledDrag: !editMode,
        })),
      );
    }
  }, [editMode]);

  const orderMutation = useBagItemOrderMutation();
  const deleteMutation = useDeleteItemMutation();

  const handlePressDelete = (item: ItemKeyProps) => {
    setSelectedItem(item.itemId);
    setIsOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem);
      setIsOpenDeleteModal(false);
      setSelectedItem(0);
    }
  };

  const renderItem = (item: ItemKeyProps) => {
    const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];

    return editMode ? (
      <StyleView>
        <DeleteButton onPressDelete={() => handlePressDelete(item)} />
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
        {isOpenDeleteModal && (
          <CustomModal
            visible={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            onCancel={() => setIsOpenDeleteModal(false)}
            onConfirm={handleDelete}
            category={'DELETE_ITEM'}
          />
        )}
      </StyleView>
    ) : (
      <BagThing item={item} navigation={navigation} />
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
            orderMutation.mutate({
              bagId: selectBagId,
              requestItems: updatedData.map((item, index) => ({
                itemId: item.itemId,
                orderId: index + 1,
              })),
            });
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
