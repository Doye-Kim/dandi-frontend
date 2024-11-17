import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DraggableGrid from 'react-native-draggable-grid';
import styled from 'styled-components/native';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
} from '@/utils';
import { ItemKeyProps, StyleItemIcon } from './BagThings';
import { CheckIcon, DeleteBagIcon } from '@/assets/icons';
import { colors } from '@/constants';
import {
  useBagItemQuery,
  useBagItemOrderMutation,
  useDeleteItemMutation,
  useDrawerItemQuery,
  useDrawerItemOrderMutation,
  useMoveDrawerItemMutation,
} from '@/queries/bagQueries';
import { RequestItemOrderProps } from '@/api/bag';
import CustomText from '@/components/common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from '../DeleteButton';
import CustomModal from '@/components/common/CustomModal';

const BagDrawer = ({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) => {
  const editMode = useBagStore((state) => state.editMode);
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);
  const [drawerKeyItems, setDrawerKeyItems] = useState<ItemKeyProps[]>([]);
  const [selectItems, setSelectItems] = useState<ItemKeyProps[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const {
    data: drawerItems,
    error,
    refetch,
  } = useDrawerItemQuery(selectBagId, defaultBagId);

  useFocusEffect(
    useCallback(() => {
      console.log('drawer refetch');
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (drawerItems) {
      setDrawerKeyItems(
        drawerItems.map((item) => ({
          ...item,
          key: `bag-${item.itemId}`,
          disabledDrag: !editMode,
        })),
      );
    }
    if (error) {
      checkErrorAndViewToast(error);
    }
  }, [drawerItems, error]);

  useEffect(() => {
    setDrawerKeyItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        disabledDrag: !editMode,
      })),
    );
  }, [editMode]);

  const drawerOrderMutation = useDrawerItemOrderMutation();
  const bagOrderMutation = useBagItemOrderMutation();

  const { data: bagItems } = useBagItemQuery(selectBagId, defaultBagId);

  const [updatedBagItemsOrder, setUpdatedBagItemsOrder] =
    useState<RequestItemOrderProps[]>();
  const [updatedDrawerItemsOrder, setUpdatedDrawerItemsOrder] =
    useState<RequestItemOrderProps[]>();

  const deleteMutation = useDeleteItemMutation();
  const moveMutation = useMoveDrawerItemMutation();

  const handleDelete = async () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem);
      setIsOpenDeleteModal(false);
      setSelectedItem(0);
    }
  };

  const handlePressItem = (item: ItemKeyProps) => {
    setSelectItems((prevItems: ItemKeyProps[]) => {
      const itemExists = prevItems.includes(item);

      if (itemExists) {
        return prevItems.filter((prev) => prev.itemId !== item.itemId);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const handlePressDelete = (item: ItemKeyProps) => {
    setSelectedItem(item.itemId);
    setIsOpenDeleteModal(true);
  };

  useEffect(() => {
    if (bagItems && drawerItems) {
      setUpdatedBagItemsOrder([
        ...bagItems.map((bagItem, index) => ({
          itemId: bagItem.itemId,
          orderId: index + 1,
        })),
        ...selectItems.map((item, index) => ({
          itemId: item.itemId,
          orderId: bagItems.length + index + 1,
        })),
      ]);

      const selectedItemIds = selectItems.map((item) => item.itemId);

      setUpdatedDrawerItemsOrder(
        drawerItems
          .filter((drawerItem) => !selectedItemIds.includes(drawerItem.itemId))
          .map((drawerItem, index) => ({
            itemId: drawerItem.itemId,
            orderId: index + 1,
          })),
      );
    }
  }, [selectItems]);

  const handlePutBag = async () => {
    setSelectItems([]);
    if (updatedDrawerItemsOrder && updatedBagItemsOrder) {
      try {
        await moveMutation.mutateAsync({
          selectBagId: selectBagId,
          requestItems: selectItems.map((item) => item.itemId),
        });

        drawerOrderMutation.mutate(updatedDrawerItemsOrder);
        bagOrderMutation.mutate({
          bagId: selectBagId,
          requestItems: updatedBagItemsOrder,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderItem = (item: ItemKeyProps) => {
    const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];
    const isSelected = selectItems.includes(item);

    return !item.disabledDrag ? (
      <StyleView>
        {editMode && (
          <TouchableOpacity
            onPress={() => handlePressDelete(item)}
            style={{ position: 'absolute', zIndex: 10, top: 0, left: 5 }}>
            <DeleteBagIcon width={15} height={15} />
          </TouchableOpacity>
        )}
        <StyleItemIcon color={color}>
          <Text style={{ fontSize: 24 }}>{item.emoticon}</Text>
        </StyleItemIcon>
        <StyledNameText length={item.name.length}>{item.name}</StyledNameText>
      </StyleView>
    ) : (
      <StyleTouchable onPress={() => handlePressItem(item)}>
        {isSelected ? (
          <StyleSelectItemIcon>
            <Text style={{ fontSize: 20, position: 'absolute' }}>
              {item.emoticon}
            </Text>
            <CheckIcon width={40} height={40} />
          </StyleSelectItemIcon>
        ) : (
          <StyleItemIcon color={color}>
            <Text style={{ fontSize: 24 }}>{item.emoticon}</Text>
          </StyleItemIcon>
        )}
        <StyledNameText length={item.name.length}>{item.name}</StyledNameText>
      </StyleTouchable>
    );
  };

  return (
    <ModalBackground onPress={onDismiss}>
      <StyleContainer>
        {drawerKeyItems.length > 0 ? (
          <>
            <View style={{ maxHeight: responsiveVertical(720) }}>
              <ScrollView>
                <DraggableGrid
                  numColumns={7}
                  style={{ margin: 20, flexWrap: 'wrap' }}
                  itemHeight={responsiveVertical(75)}
                  renderItem={renderItem}
                  data={drawerKeyItems}
                  onDragRelease={(updatedData) => {
                    setDrawerKeyItems(updatedData);
                    drawerOrderMutation.mutate(
                      updatedData.map((item, index) => ({
                        itemId: item.itemId,
                        orderId: index + 1,
                      })),
                    );
                  }}
                />
              </ScrollView>
            </View>
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
        {isOpenDeleteModal && (
          <CustomModal
            visible={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            onCancel={() => setIsOpenDeleteModal(false)}
            onConfirm={handleDelete}
            category={'DELETE_ITEM'}
          />
        )}
      </StyleContainer>
    </ModalBackground>
  );
};

export default BagDrawer;

const ModalBackground = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyleEmptyItemText = styled(CustomText)`
  padding: 10px;
  font-size: 12px;
  text-align: center;
  color: ${colors.BEIGE_500};
`;
const StyleContainer = styled.View`
  width: ${responsive(352)}px;
  border-radius: 30px;
  position: absolute;
  right: 10px;
  bottom: 90px;
  background-color: ${colors.BEIGE_300};
  elevation: 8;
`;
const StyleView = styled.View`
  justify-content: center;
  align-items: center;
  width: ${responsive(352 / 7)}px;
  height: ${responsiveVertical(75)}px;
`;

const StyleTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: ${responsive(352 / 7)}px;
  height: ${responsiveVertical(75)}px;
`;

const StyleSelectItemIcon = styled.View`
  border-radius: 20px;
  background-color: 'rgba(139, 88, 67, 0.5)';
  width: ${responsive(38)}px;
  height: ${responsiveVertical(42)}px;
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

const StyledNameText = styled(CustomText)<{ length: number }>`
  margin-top: 3px;
  height: 28px;
  font-size: ${({ length }) => (length > 4 ? 9 : 11)};
`;
