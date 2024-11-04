import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import CustomBagHeader from '@/components/bag/CustomBagHeader';
import BagListItem from '@/components/bag/BagListItem';
import data from '@/dummy/bag.json';
import { BagItem } from '@/components/bag/MainBagList';

const BagListScreen = () => {
  const [bagData, setBagData] = useState<BagItem[]>([]);
  const [currentBagId, setCurrentBagId] = useState<number>(0);

  // #todo: 순서 변경 후 bagData 다시 조회
  const handleDragEnd = ({ data }: { data: BagItem[] }) => {
    setBagData(data);
    const newData = data;
    setBagData(newData);
    const reorderedData = newData.map((item, index) => ({
      bagId: item.id,
      order: index + 2,
    }));
    reorderedData.push({ bagId: currentBagId, order: 1 });
    console.log(reorderedData);
  };

  const renderItem = ({ item, drag }: RenderItemParams<BagItem>) => (
    <BagListItem item={item} drag={drag} /> // drag를 BagListItem에 전달
  );

  useEffect(() => {
    const currentBag = data.find((item) => item.name === '현재 가방');
    if (currentBag) {
      setCurrentBagId(currentBag.id);
    }
    const sortedData = data
      .filter((item) => item.name !== '현재 가방')
      .sort((a, b) => a.bagOrder - b.bagOrder);
    setBagData(sortedData);
  }, []);
  return (
    <SafeAreaView>
      <CustomBagHeader />
      <DraggableFlatList
        data={bagData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={handleDragEnd}
      />
    </SafeAreaView>
  );
};

export default BagListScreen;
