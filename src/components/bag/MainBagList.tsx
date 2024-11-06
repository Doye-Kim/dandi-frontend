import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';
import CustomText from '../common/CustomText';
import bag from '@/dummy/bag.json';
import useBagStore from '@/store/useBagStore';

// #todo: api/bag.ts 으로 넘길 것
export interface BagItem {
  id: number;
  bagOrder: number;
  name: string;
}

const MainBagList = () => {
  const [bagList, setBagList] = useState<BagItem[]>();
  const {
    editMode,
    selectBagId,
    defaultBagId,
    setEditMode,
    setSelectBagId,
    setDefaultBagId,
  } = useBagStore();

  useEffect(() => {
    const sortedBagList = [...bag].sort((a, b) => a.bagOrder - b.bagOrder);
    setBagList(sortedBagList);
    setSelectBagId(sortedBagList[0].id);
    setDefaultBagId(sortedBagList[0].id);
  }, []);

  // #todo: 편집 모드일 때 다른 가방을 누르면 모달으로 알림, 변경 사항을 취소하고 돌아가시겠습니까? 뭐 이런 거
  useEffect(() => {
    if (editMode) {
      console.log('변경을 취소하고 돌아가시겟냐는 모달');
    }
  }, [selectBagId]);

  return (
    <FlatList
      data={bagList}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const Container =
          item.id === selectBagId ? SelectBagContainer : StyleBagContainer;
        const BagText = item.id === selectBagId ? SelectBagText : CustomText;
        return (
          <Container onPress={() => setSelectBagId(item.id)}>
            <BagText style={{ fontSize: 16 }}>{item.name}</BagText>
          </Container>
        );
      }}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default MainBagList;

const StyleBagContainer = styled.TouchableOpacity`
  background-color: ${colors.GRAY_300};
  border-radius: ${responsive(10)}px;
  padding-horizontal: ${responsive(15)}px;
  padding-vertical: ${responsiveVertical(7)}px;
  margin-right: ${responsive(10)}px;
`;
const SelectBagContainer = styled(StyleBagContainer)`
  background-color: ${colors.GRAY_900};
`;
const SelectBagText = styled(CustomText)`
  color: ${colors.WHITE};
`;
