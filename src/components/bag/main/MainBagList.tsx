import { useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
} from '@/utils';
import CustomText from '../../common/CustomText';
import useBagStore from '@/store/useBagStore';
import { useBagQuery } from '@/queries/bagQueries';

const MainBagList = () => {
  const { selectBagId, defaultBagId, setSelectBagId } = useBagStore();
  const { data: bagList, error } = useBagQuery();

  useEffect(() => {
    if (bagList) {
      setSelectBagId(defaultBagId);
    }
    if (error) {
      checkErrorAndViewToast(error);
    }
  }, [bagList, error]);

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
