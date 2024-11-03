import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { items } from '@/dummy/bagitem.json';
import BagThing from './BagThing';

export interface BagThingItem {
  itemId: number;
  itemOrder: number;
  name: string;
  emoticon: string;
  colorKey: number;
  createdAt: string;
  updatedAt: string;
}

const BagThings = ({ bagId }: { bagId: number | undefined }) => {
  const [bagThings, setBagThings] = useState<BagThingItem[]>([]);

  useEffect(() => {
    const sortedBagThings = [...items].sort(
      (a, b) => a.itemOrder - b.itemOrder,
    );
    setBagThings(sortedBagThings);
  }, []);

  return (
    <FlatList
      data={bagThings}
      renderItem={({ item }) => {
        return <BagThing item={item} />;
      }}
      keyExtractor={(item) => item.itemId.toString()}
      numColumns={5}
      contentContainerStyle={{
        justifyContent: 'flex-start',
      }}
    />
  );
};

export default BagThings;
