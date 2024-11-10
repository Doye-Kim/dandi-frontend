import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { PickupDetailData } from '@/types/lost';
import { colors } from '@/constants';
import { BASE_IMAGE_URL } from '@/api/axios';
import CustomText from '@/components/common/CustomText';

interface MyPickupListItemProps {
  item: PickupDetailData;
  onPress: () => void;
}

const MyPickupListItem = ({ item, onPress }: MyPickupListItemProps) => {
  // todo: 위치 정보 => 주소로 변경
  // todo: 날짜 정보 => 날짜로 변경

  return (
    <ItemContainer onPress={onPress}>
      <Image
        source={{ uri: `${BASE_IMAGE_URL}${item.image}` }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
        }}
      />
      <CustomText>{`위치: ${item.foundLocation.lat.toFixed(
        2,
      )}, ${item.foundLocation.lon.toFixed(2)}`}</CustomText>
    </ItemContainer>
  );
};

export default MyPickupListItem;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
  background-color: ${colors.WHITE};
`;
