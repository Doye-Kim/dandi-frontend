import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
} from '@/utils';
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
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);

  const [bagKeyItems, setBagKeyItems] = useState<ItemKeyProps[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const {
    data: bagItems,
    error,
    refetch,
  } = useBagItemQuery(selectBagId, defaultBagId);

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

  useFocusEffect(
    useCallback(() => {
      console.log('bagThing refetch');
      refetch();
    }, [refetch]),
  );

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

  const renderItem = (item: ItemKeyProps, index: number) => {
    const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];

    return editMode ? (
      <StyleView>
        <DeleteButton onPressDelete={() => handlePressDelete(item)} />
        <StyleItemIcon color={color}>
          <Text style={{ fontSize: 24 }}>{item.emoticon}</Text>
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
      <BagThing item={item} index={index} navigation={navigation} />
    );
  };

  return (
    <View>
      {bagKeyItems.length > 0 ? (
        <ScrollView>
          <DraggableGrid
            style={{ flex: 1 }}
            numColumns={5}
            renderItem={(item, index) => renderItem(item, index)}
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
        </ScrollView>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomText>현재 가방에 들어있는 소지품이 없어요</CustomText>
          <CustomText>서랍에서 꺼내오거나, 추가해 보세요!</CustomText>
        </View>
      )}
      {isOpenDeleteModal && (
        <CustomModal
          visible={isOpenDeleteModal}
          onClose={() => setIsOpenDeleteModal(false)}
          onCancel={() => setIsOpenDeleteModal(false)}
          onConfirm={handleDelete}
          category={'DELETE_ITEM'}
        />
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
  height: ${responsiveVertical(85)}px;
  padding-horizontal: 3px;
`;
