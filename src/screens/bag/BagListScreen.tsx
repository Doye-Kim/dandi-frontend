import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useQuery } from '@tanstack/react-query';
import CustomBagHeader from '@/components/bag/list/CustomBagHeader';
import BagListItem from '@/components/bag/list/BagListItem';
import data from '@/dummy/bag.json';
import { BagProps, getBags } from '@/api/bag';
import useBagStore from '@/store/useBagStore';
import Toast from 'react-native-toast-message';

const BagListScreen = () => {
  const [sortedBagData, setSortedBagData] = useState<BagProps[]>([]);
  const { data: bagList, error } = useQuery({
    queryKey: ['bags'],
    queryFn: getBags,
    select: (data) => data.sort((a, b) => a.bagOrder - b.bagOrder),
  });
  const defaultBagId = useBagStore((state) => state.defaultBagId);

  useEffect(() => {
    if (bagList) {
      const sortedData = bagList.filter((item) => item.id !== defaultBagId);
      setSortedBagData(sortedData);
    }
    if (error) {
      Toast.show({
        type: 'error',
        text1: error.message
          ? error.message
          : '가방 목록을 불러오는 데 알 수 없는 오류가 발생했습니다. 다시 시도해 주세요',
      });
    }
  }, [bagList, error]);

  // #todo: 순서 변경 후 bagData 다시 조회
  const handleDragEnd = ({ data }: { data: BagProps[] }) => {
    const reorderedData = data.map((item, index) => ({
      bagId: item.id,
      order: index + 2,
    }));
    reorderedData.push({ bagId: defaultBagId, order: 1 });
    console.log(reorderedData);
  };

  const renderItem = ({ item, drag }: RenderItemParams<BagProps>) => (
    <BagListItem item={item} drag={drag} /> // drag를 BagListItem에 전달
  );

  return (
    <SafeAreaView>
      <CustomBagHeader />
      <DraggableFlatList
        data={sortedBagData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={handleDragEnd}
      />
    </SafeAreaView>
  );
};

export default BagListScreen;
