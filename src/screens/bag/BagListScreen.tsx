import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import axios from 'axios';
import CustomBagHeader from '@/components/bag/list/CustomBagHeader';
import BagListItem from '@/components/bag/list/BagListItem';
import { BagProps, getBags } from '@/api/bag';
import useBagStore from '@/store/useBagStore';
import { showErrorToast } from '@/utils';
import { useBagQuery } from '@/queries/bagQueries';

const BagListScreen = () => {
  const [sortedBagData, setSortedBagData] = useState<BagProps[]>([]);
  const { data: bagList, error } = useBagQuery();
  const defaultBagId = useBagStore((state) => state.defaultBagId);

  useEffect(() => {
    if (bagList) {
      const sortedData = bagList.filter((item) => item.id !== defaultBagId);
      setSortedBagData(sortedData);
    }
    if (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
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
    <BagListItem item={item} drag={drag} />
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
