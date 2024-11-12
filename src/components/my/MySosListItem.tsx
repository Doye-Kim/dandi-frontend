import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { SOSDetailData } from '@/types/lost';
import { colors } from '@/constants';
import { BASE_IMAGE_URL } from '@/api/axios';
import { responsive } from '@/utils/common';
import { convertDateTimeFormat } from '@/utils/date';
import CustomText from '@/components/common/CustomText';

interface MySosListItemProps {
  item: SOSDetailData;
  onPress: () => void;
}

const MySosListItem = ({ item, onPress }: MySosListItemProps) => {
  return (
    <Container onPress={onPress}>
      <ContentWrapper>
        <ImageBox>
          <Image
            source={{ uri: `${BASE_IMAGE_URL}${item.images[0]}` }}
            style={{
              width: responsive(80),
              height: responsive(80),
              borderRadius: 10,
            }}
          />
        </ImageBox>
        <SimpleInfoBox>
          <CustomText numberOfLines={1} ellipsizeMode='tail'>
            {item.situationDescription}
          </CustomText>
          <CustomText
            numberOfLines={1}
            ellipsizeMode='tail'>{`${convertDateTimeFormat(
            new Date(item.lostAt),
          )}`}</CustomText>
        </SimpleInfoBox>
      </ContentWrapper>
    </Container>
  );
};

export default MySosListItem;

const Container = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
  background-color: ${colors.WHITE};
`;

const ContentWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding-horizontal: ${responsive(10)} px;
`;

const ImageBox = styled.View`
  flex: 3;
  align-items: center;
  width: ${responsive(80)}px;
  height: ${responsive(80)}px;
`;

const SimpleInfoBox = styled.View`
  flex: 7;
  justify-content: center;
  gap: ${responsive(6)}px;
  height: ${responsive(80)}px;
`;
