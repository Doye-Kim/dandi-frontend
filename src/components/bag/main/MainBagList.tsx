import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components/native';
import axios from 'axios';
import { colors } from '@/constants';
import { responsive, responsiveVertical, showErrorToast } from '@/utils';
import { BagProps, getBags } from '@/api/bag';
import CustomText from '../../common/CustomText';
import useBagStore from '@/store/useBagStore';
import { useBagQuery } from '@/queries/bagQueries';

const MainBagList = () => {
  const { editMode, selectBagId, defaultBagId, setSelectBagId } = useBagStore();

  const { data: bagList, error } = useBagQuery();
  // #todo: 로그인 시 디폴드 가방 아이디 설정
  useEffect(() => {
    if (bagList) {
      setSelectBagId(defaultBagId);
    }
    if (axios.isAxiosError(error) && error.response?.data) {
      const { code } = error.response.data as { code: string };
      showErrorToast(code);
    }
  }, [bagList, error]);

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
