import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { SOSDetailData } from '@/types/lost';
import { colors } from '@/constants';
import { BASE_IMAGE_URL } from '@/api/axios';
import CustomText from '@/components/common/CustomText';

interface MySosListItemProps {
  item: SOSDetailData;
  onPress: () => void;
}

const MySosListItem = ({ item, onPress }: MySosListItemProps) => {
  return (
    <ItemContainer onPress={onPress}>
      <Image
        source={{ uri: `${BASE_IMAGE_URL}${item.images[0]}` }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
        }}
      />
      <CustomText>{item.lostAt}</CustomText>
      <CustomText>안녕안ㄴ여</CustomText>
    </ItemContainer>
  );
};

export default MySosListItem;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
  background-color: ${colors.WHITE};
`;
