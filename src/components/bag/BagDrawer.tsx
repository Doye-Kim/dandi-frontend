import { ScrollView, View } from 'react-native';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import CustomText from '../common/CustomText';
import data from '@/dummy/draweritem.json';
import DrawerItem, { BagDrawerItem } from './DrawerItem';
import { useEffect, useState } from 'react';

const BagDrawer = ({ bagId }: { bagId: number | undefined }) => {
  const [drawerItems, setDrawerItems] = useState<BagDrawerItem[]>();
  useEffect(() => {
    const sortedData = data.sort((a, b) => a.itemOrder - b.itemOrder);
    setDrawerItems(sortedData);
  }, []);
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: responsive(352),
        margin: 10,
      }}>
      <CustomText style={{ fontSize: 18, marginBottom: 10 }}>서랍</CustomText>
      <View
        style={{
          backgroundColor: colors.GRAY_300,
          padding: 10,
          borderRadius: 20,
        }}>
        {drawerItems && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
            style={{ maxHeight: 100 }}>
            {drawerItems.map((item) => (
              <DrawerItem key={item.id} item={item} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default BagDrawer;
