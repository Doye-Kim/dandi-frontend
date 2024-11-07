import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { bagNavigations, colors } from '@/constants';
import {
  BagThingItemKey,
  StyleView,
  StyleItemIcon,
  StyleTouchable,
} from './BagThings';
import { DoubleAngleIcon, SparkleIcon, TrashRedIcon } from '@/assets/icons';
import CustomText from '../common/CustomText';
import { useNavigation } from '@react-navigation/native';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
type BagNavigationProp = StackNavigationProp<
  BagStackParamList,
  typeof bagNavigations.BAG_MAIN
>;

const BagThing = ({ item }: { item: BagThingItemKey }) => {
  const [isOpenActionModal, setIsOpenActionModal] = useState<boolean>(false);
  const navigation = useNavigation<BagNavigationProp>();

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
  const itemTop = 170 + 90 * Math.floor((item.itemOrder - 1) / 5);
  const top = 170 + 90 * (Math.floor((item.itemOrder - 1) / 5) + 1);

  const position = (() => {
    const orderInRow = (item.itemOrder - 1) % 5;
    if (orderInRow <= 2) return { left: 0 };
    else return { right: 0 };
  })();

  const itemPosition = (() => {
    const orderInRow = (item.itemOrder - 1) % 5;

    if (orderInRow === 0) {
      return { left: 0 };
    } else if (orderInRow === 1) {
      return { left: 372 / 5 };
    } else if (orderInRow === 2) {
      return { left: (372 / 5) * 2 };
    } else if (orderInRow === 3) {
      return { right: 372 / 5 };
    } else {
      return { right: 0 };
    }
  })();

  const handlePressEdit = () => {
    setIsOpenActionModal(false);
    navigation.navigate(bagNavigations.BAG_ITEM, { item });
  };
  return (
    <>
      <StyleTouchable onLongPress={handleLongPress}>
        <StyleView>
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
              <StyledTouchableOpacityIng>
                <StyleText>서랍으로 이동</StyleText>
                <DoubleAngleIcon width={15} height={15} />
              </StyledTouchableOpacityIng>
              <StyledTouchableOpacityIng onPress={handlePressEdit}>
                <StyleText>소지품 수정</StyleText>
                <SparkleIcon width={15} height={15} />
              </StyledTouchableOpacityIng>
              <StyledTouchableOpacity>
                <StyleTextRed>제거하기</StyleTextRed>
                <TrashRedIcon width={15} height={15} />
              </StyledTouchableOpacity>
            </StyledModalBackground>
          </Modal>
        </Portal>
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
  font-size: 11px;
`;

const StyleTextRed = styled(StyleText)`
  color: ${colors.RED_DELETE};
`;
