/// BackDrawer
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import { BagThingItem } from './BagThings';
import BagThing from './BagThing';
import CustomText from '../common/CustomText';
import useBagStore from '@/store/useBagStore';

const data = [
  {
    itemId: 1,
    itemOrder: 3,
    name: '지갑',
    emoticon: '💼',
    colorKey: 1,
    createdAt: '2024-10-20T10:00:00',
    updatedAt: '2024-10-22T08:00:00',
  },
  {
    itemId: 2,
    itemOrder: 1,
    name: '여권',
    emoticon: '🛂',
    colorKey: 2,
    createdAt: '2024-10-20T11:00:00',
    updatedAt: '2024-10-22T08:30:00',
  },
  {
    itemId: 3,
    itemOrder: 4,
    name: '책',
    emoticon: '📖',
    colorKey: 3,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 4,
    itemOrder: 2,
    name: '책2',
    emoticon: '📖',
    colorKey: 4,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 5,
    itemOrder: 5,
    name: '일이삼사오육칠팔구십',
    emoticon: '📖',
    colorKey: 5,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 6,
    itemOrder: 6,
    name: '일이삼사오육칠팔구십',
    emoticon: '📖',
    colorKey: 6,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
  {
    itemId: 7,
    itemOrder: 6,
    name: '꺄륵',
    emoticon: '💼',
    colorKey: 6,
    createdAt: '2024-10-21T09:00:00',
    updatedAt: '2024-10-23T09:30:00',
  },
];

const BagDrawer = () => {
  const editMode = useBagStore((state) => state.editMode);
  const selectBagId = useBagStore((state) => state.selectBagId);
  const [drawerItems, setDrawerItems] = useState<BagThingItem[]>();
  // data.sort((a, b) => a.itemOrder - b.itemOrder),
  useEffect(() => {
    setDrawerItems(data);
  }, []);
  const handleDragEnd = ({ data }: { data: BagThingItem[] }) => {
    setDrawerItems(data);
    const reorderedData = data.map((item, index) => ({
      ...item,
      itemOrder: index + 1,
    }));
    console.log(reorderedData);
  };

  const renderItem = ({ item, drag }: RenderItemParams<BagThingItem>) => (
    <BagThing item={item} drag={drag} />
  );
  return (
    <DrawerContainer>
      <CustomText style={{ fontSize: 18, marginBottom: 10 }}>서랍</CustomText>
      <DrawerBackground>
        {drawerItems && (
          <DraggableFlatList
            data={drawerItems}
            horizontal={true}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.itemId.toString()}
            onDragEnd={handleDragEnd}
          />
        )}
      </DrawerBackground>
    </DrawerContainer>
  );
};

const DrawerContainer = styled.View`
  position: absolute;
  bottom: 0px;
  width: ${responsive(352)}px;
  margin: ${10}px;
`;

const DrawerBackground = styled.View`
  background-color: ${colors.GRAY_300};
  // padding-horizontal: ${responsive(10)}px;
  height: ${responsiveVertical(100)}px;
  border-radius: ${responsive(20)}px;
  align-items: center;
`;

export default BagDrawer;
