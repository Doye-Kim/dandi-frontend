import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import DraggableGrid from 'react-native-draggable-grid';
import { colors } from '@/constants';
import { responsive, showErrorToast } from '@/utils';
import { CheckIcon } from '@/assets/icons';
import { ItemKeyProps, StyleItemIcon } from './BagThings';
import CustomText from '../../common/CustomText';
import useBagStore from '@/store/useBagStore';
import DeleteButton from '../DeleteButton';
import CustomModal from '../modal/CustomModal';
import {
  useBagItemQuery,
  useBagOrderMutation,
  useDeleteItemMutation,
  useDrawerItemQuery,
  useDrawerOrderMutation,
  useMoveDrawerItemMutation,
} from '@/queries/bagQueries';
import { RequestItemOrderProps } from '@/api/bag';

const BagDrawer = () => {
  const editMode = useBagStore((state) => state.editMode);
  const isEditComplete = useBagStore((state) => state.isEditComplete);
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);
  const [drawerKeyItems, setDrawerKeyItems] = useState<ItemKeyProps[]>([]);
  const [selectItems, setSelectItems] = useState<ItemKeyProps[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const { data: drawerItems, error } = useDrawerItemQuery(
    selectBagId,
    defaultBagId,
  );

  useEffect(() => {
    if (drawerItems) {
      console.log('drawer', drawerItems);
      setDrawerKeyItems(
        drawerItems.map((item) => ({
          ...item,
          key: `bag-${item.itemId}`,
          disabledDrag: !editMode,
        })),
      );
    }
    if (axios.isAxiosError(error) && error.response?.data) {
      const { code } = error.response.data as { code: string; message: string };
      showErrorToast(code);
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

  const drawerOrderMutation = useDrawerOrderMutation();
  const bagOrderMutation = useBagOrderMutation();

  const { data: bagItems } = useBagItemQuery(selectBagId, defaultBagId);

  const [updatedBagItemsOrder, setUpdatedBagItemsOrder] =
    useState<RequestItemOrderProps[]>();
  const [updatedDrawerItemsOrder, setUpdatedDrawerItemsOrder] =
    useState<RequestItemOrderProps[]>();

  // useEffect(() => {
  //   if (bagItems && drawerItems) {
  //     setUpdatedBagItemsOrder([
  //       ...bagItems.map((bagItem, index) => ({
  //         itemId: bagItem.itemId,
  //         orderId: index + 1,
  //       })),
  //       ...selectItems.map((item, index) => ({
  //         itemId: item.itemId,
  //         orderId: bagItems.length + index + 1,
  //       })),
  //     ]);
  //     const selectedItemIds = selectItems.map((item) => item.itemId);

  //     setUpdatedDrawerItemsOrder(
  //       drawerItems
  //         .filter((drawerItem) => !selectedItemIds.includes(drawerItem.itemId))
  //         .map((drawerItem, index) => ({
  //           itemId: drawerItem.itemId,
  //           orderId: index + 1,
  //         })),
  //     );
  //   }
  // }, [selectItems]);

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
        // `moveMutation`이 완료될 때까지 대기
        await moveMutation.mutateAsync({
          selectBagId: selectBagId,
          requestItems: selectItems.map((item) => item.itemId),
        });

        // `moveMutation`이 완료된 후에 순서 업데이트
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
          <DeleteButton onPressDelete={() => handlePressDelete(item)} />
        )}
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
      <StyleTouchable onPress={() => handlePressItem(item)}>
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
      {drawerKeyItems.length > 0 ? (
        <>
          <ScrollView>
            <DraggableGrid
              numColumns={4}
              style={{ margin: 20, flexWrap: 'wrap' }}
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
