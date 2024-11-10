import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { bagNavigations, colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { DrawerIcon, FolderIcon } from '@/assets/icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import BagHeader from '@/components/bag/main/BagHeader';
import MainBagList from '@/components/bag/main/MainBagList';
import BagActionBar from '@/components/bag/main/BagActionBar';
import BagThings from '@/components/bag/main/BagThings';
import BagDrawer from '@/components/bag/main/BagDrawer';
import useBagStore from '@/store/useBagStore';

export type BagScreenProps = {
  navigation: StackNavigationProp<
    BagStackParamList,
    typeof bagNavigations.BAG_MAIN
  >;
};

const BagMainScreen = ({ navigation }: BagScreenProps) => {
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);
  const editMode = useBagStore((state) => state.editMode);
  const rotation = useRef(new Animated.Value(0)).current;
  const decreaseFactor = useRef(5);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        decreaseFactor.current = Math.max(5, decreaseFactor.current * 0.9);
      });
    };

    animate();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: [
      `-${decreaseFactor.current}deg`,
      `${decreaseFactor.current}deg`,
    ],
  });

  const handlePressDrawer = () => {
    setIsOpenDrawer((prev) => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BagHeader />
      <StyleBagListContainer>
        <MainBagList />
        <StyleFolderContainer
          onPress={() => navigation.navigate(bagNavigations.BAG_LIST)}>
          <FolderIcon width={25} height={25} />
        </StyleFolderContainer>
      </StyleBagListContainer>
      <Divider />
      <BagActionBar navigation={navigation} />
      <BagThings navigation={navigation} />
      <AnimatedTouchableOpacity
        onPress={handlePressDrawer}
        style={{
          transform: [{ rotate }],
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}>
        <DrawerIcon width={60} height={60} />
      </AnimatedTouchableOpacity>
      {isOpenDrawer && <BagDrawer />}
    </SafeAreaView>
  );
};

export default BagMainScreen;

const StyleFolderContainer = styled.TouchableOpacity`
  padding: ${responsive(5)}px;
  border-radius: ${responsive(20)}px;
  border-width: 1px;
  border-color: ${colors.GRAY_400};
  margin-left: ${responsive(10)}px;
`;

const StyleBagListContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: ${responsive(10)}px;
  margin-top: ${responsiveVertical(10)}px;
`;

const Divider = styled.View`
  margin-top: 15px;
  width: 100%;
  height: 5px;
  background-color: ${colors.GRAY_300};
`;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
