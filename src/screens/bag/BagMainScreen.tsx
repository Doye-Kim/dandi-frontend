import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { bagNavigations, colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { FolderIcon } from '@/assets/icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import BagHeader from '@/components/bag/BagHeader';
import MainBagList from '@/components/bag/MainBagList';
import BagActionBar from '@/components/bag/BagActionBar';
import BagThings from '@/components/bag/BagThings';
import BagDrawer from '@/components/bag/BagDrawer';

export type BagScreenProps = {
  navigation: StackNavigationProp<
    BagStackParamList,
    typeof bagNavigations.BAG_MAIN
  >;
};
const BagMainScreen = ({ navigation }: BagScreenProps) => {
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
      <BagActionBar />
      <BagThings />
      <BagDrawer />
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
