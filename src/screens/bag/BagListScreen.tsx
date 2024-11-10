import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import axios from 'axios';
import CustomBagHeader from '@/components/bag/list/CustomBagHeader';
import BagListItem from '@/components/bag/list/BagListItem';
import { BagProps, getBags } from '@/api/bag';
import useBagStore from '@/store/useBagStore';
import { showErrorToast } from '@/utils';
import { useBagOrderMutation, useBagQuery } from '@/queries/bagQueries';
import CustomText from '@/components/common/CustomText';

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

  const orderMutation = useBagOrderMutation();
  const handleDragEnd = ({ data }: { data: BagProps[] }) => {
    const reorderedData = data.map((item, index) => ({
      bagId: item.id,
      order: index + 2,
    }));
    reorderedData.push({ bagId: defaultBagId, order: 1 });
    orderMutation.mutate(reorderedData);
  };

  const renderItem = ({ item, drag }: RenderItemParams<BagProps>) => (
    <BagListItem item={item} drag={drag} />
  );

  return (
    <SafeAreaView>
      <CustomBagHeader />
      {sortedBagData.length > 0 ? (
        <DraggableFlatList
          data={sortedBagData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomText>나만의 가방이 없습니다. 만들어 보세요!</CustomText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BagListScreen;
