import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import BagHeader from '@/components/bag/BagHeader';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { FolderIcon } from '@/assets/icons';
import BagList from '@/components/bag/BagList';
import BagActionBar from '@/components/bag/BagActionBar';
import BagThings from '@/components/bag/BagThings';
import BagDrawer from '@/components/bag/BagDrawer';

const BagMainScreen = () => {
  const [selectBagId, setSelectBagId] = useState<number | undefined>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BagHeader />
      <StyleBagListContainer>
        <BagList selectBagId={selectBagId} setSelectBagId={setSelectBagId} />
        <StyleFolderContainer>
          <FolderIcon width={25} height={25} />
        </StyleFolderContainer>
      </StyleBagListContainer>
      <Divider />
      <BagActionBar />
      <BagThings bagId={selectBagId} />
      <BagDrawer bagId={selectBagId} />
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
`;

const Divider = styled.View`
  margin-top: 15px;
  width: 100%;
  height: 5px;
  background-color: ${colors.GRAY_300};
`;
