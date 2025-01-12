import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { bagNavigations, colors } from '@/constants';
import { StyleItemIcon, StyleTouchable, ItemKeyProps } from './BagThings';
import { DoubleAngleIcon, SparkleIcon, TrashRedIcon } from '@/assets/icons';
import { BagScreenProps } from '@/screens/bag/BagMainScreen';
import {
  useBagItemMoveToDrawerMutation,
  useBagItemQuery,
  useBagItemOrderMutation,
  useDeleteItemMutation,
  useDrawerItemQuery,
  useDrawerItemOrderMutation,
} from '@/queries/bagQueries';
import { RequestItemOrderProps } from '@/api/bag';
import CustomModal from '@/components/common/CustomModal';
import CustomText from '@/components/common/CustomText';
import useBagStore from '@/store/useBagStore';
import { responsive, responsiveVertical } from '@/utils';

const BagThing = ({
  item,
  index,
  navigation,
}: {
  item: ItemKeyProps;
  index: number;
  navigation: BagScreenProps['navigation'];
}) => {
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenActionModal, setIsOpenActionModal] = useState<boolean>(false);
  const color = colors[`THINGS_${item.colorKey}` as keyof typeof colors];

  // 애니메이션
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startBouncing = () => {
    Animated.timing(bounceAnim, {
      toValue: 1.1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    if (isOpenActionModal) {
      startBouncing();
    }
  }, [isOpenActionModal]);

  const handleLongPress = () => {
    setIsOpenActionModal(true);
  };

  // 포지션 계산
  const itemTop = 170 + responsiveVertical(75) * Math.floor(index / 5);

  const position = (() => {
    const orderInRow = index % 5;
    if (orderInRow <= 2) return { left: 0 };
    else return { right: 0 };
  })();

  const itemPosition = (() => {
    const orderInRow = index % 5;
    const spacing = responsive(372) / 5;
    return { left: orderInRow * spacing };
  })();

  const moveMutation = useBagItemMoveToDrawerMutation();
  const drawerOrderMutation = useDrawerItemOrderMutation();
  const bagOrderMutation = useBagItemOrderMutation();

  const { data: bagItems } = useBagItemQuery(selectBagId, defaultBagId);
  const { data: drawerItems } = useDrawerItemQuery(selectBagId, defaultBagId);

  const [updatedBagItemsOrder, setUpdatedBagItemsOrder] =
    useState<RequestItemOrderProps[]>();
  const [updatedDrawerItemsOrder, setUpdatedDrawerItemsOrder] =
    useState<RequestItemOrderProps[]>();

  useEffect(() => {
    if (bagItems && drawerItems) {
      setUpdatedBagItemsOrder(
        bagItems
          .filter((bagItem) => bagItem.itemId !== item.itemId)
          .map((bagItem, index) => ({
            itemId: bagItem.itemId,
            orderId: index + 1,
          })),
      );
      setUpdatedDrawerItemsOrder([
        ...drawerItems.map((drawerItem, index) => ({
          itemId: drawerItem.itemId,
          orderId: index + 1,
        })),
        { itemId: item.itemId, orderId: drawerItems.length + 1 },
      ]);
    }
  }, [bagItems, drawerItems]);

  const handlePressMove = async () => {
    if (updatedDrawerItemsOrder && updatedBagItemsOrder) {
      try {
        await moveMutation.mutateAsync({
          selectBagId: selectBagId,
          itemId: item.itemId,
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

  const handlePressEdit = () => {
    setIsOpenActionModal(false);
    navigation.navigate(bagNavigations.BAG_ITEM, { item });
  };

  const handlePressDelete = () => {
    setIsOpenDeleteModal(true);
  };

  const deleteMutation = useDeleteItemMutation();

  const handleDelete = async () => {
    deleteMutation.mutate(item.itemId);
    setIsOpenDeleteModal(false);
  };

  return (
    <>
      <StyleTouchable onLongPress={handleLongPress}>
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
      </StyleTouchable>
      {isOpenActionModal && (
        <Portal>
          {/* <StyledBlurBackground /> */}
          <Modal
            visible={isOpenActionModal}
            onDismiss={() => setIsOpenActionModal(false)}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            contentContainerStyle={{
              position: 'absolute',
              top: itemTop,
              ...itemPosition,
              padding: 10,
              zIndex: 10,
            }}>
            <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
              <StyleSpotlightItemIcon color={color}>
                <Text style={{ fontSize: 36 }}>{item.emoticon}</Text>
              </StyleSpotlightItemIcon>
            </Animated.View>
            <StyledModalBackground style={{ ...position }}>
              <StyledTouchableOpacityIng onPress={handlePressMove}>
                <StyleText>서랍으로 이동</StyleText>
                <DoubleAngleIcon width={15} height={15} />
              </StyledTouchableOpacityIng>
              <StyledTouchableOpacityIng onPress={handlePressEdit}>
                <StyleText>소지품 수정</StyleText>
                <SparkleIcon width={15} height={15} />
              </StyledTouchableOpacityIng>
              <StyledTouchableOpacity onPress={handlePressDelete}>
                <StyleTextRed>제거하기</StyleTextRed>
                <TrashRedIcon width={15} height={15} />
              </StyledTouchableOpacity>
            </StyledModalBackground>
          </Modal>
        </Portal>
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
    </>
  );
};

export default BagThing;

const StyledBlurBackground = styled(BlurView).attrs({
  blurType: 'light',
  blurAmount: 1,
  reducedTransparencyFallbackColor: colors.GRAY_500,
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const StyledModalBackground = styled.View`
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  position: absolute;
  top: 100%;
  margin-top: 15px;
  width: 200px;
  border-radius: 15px;
`;

export const StyleSpotlightItemIcon = styled.View<{ color: string }>`
  border-radius: 30px;
  width: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.WHITE};
  padding: 5px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ color }) => color};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledTouchableOpacityIng = styled(StyledTouchableOpacity)`
  border-bottom-width: 1px;
  border-color: ${colors.GRAY_500};
`;

const StyleText = styled(CustomText)`
  color: ${colors.WHITE};
  font-size: 11;
`;

const StyleTextRed = styled(StyleText)`
  color: ${colors.RED_DELETE};
`;
