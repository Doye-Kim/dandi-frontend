import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { BASE_IMAGE_URL } from '@/api/axios';
import { PickupDetailData } from '@/types/lost';
import { colors } from '@/constants';
import CustomText from '@/components/common/CustomText';
import { responsive } from '@/utils/common';
import { convertDateTimeFormat } from '@/utils/date';

interface MyPickupListItemProps {
  item: PickupDetailData;
  onPress: () => void;
}

const MyPickupListItem = ({ item, onPress }: MyPickupListItemProps) => {
  // todo: 위치 정보 => 주소로 변경
  // todo: 날짜 정보 => 날짜로 변경

  return (
    <Container onPress={onPress}>
      <ContentWrapper>
        <ImageBox>
          <Image
            source={{ uri: `${BASE_IMAGE_URL}${item.image}` }}
            style={{
              width: responsive(80),
              height: responsive(80),
              borderRadius: 10,
            }}
          />
        </ImageBox>
        <SimpleInfoBox>
          <CustomText
            numberOfLines={1}
            ellipsizeMode='tail'>{`${item.foundLocation.lat.toFixed(
            2,
          )}, ${item.foundLocation.lon.toFixed(
            2,
          )}(주소로 변경 예정)`}</CustomText>
          <CustomText
            numberOfLines={1}
            ellipsizeMode='tail'>{`${convertDateTimeFormat(
            new Date(item.foundAt),
          )}`}</CustomText>
        </SimpleInfoBox>
      </ContentWrapper>
    </Container>
  );
};

export default MyPickupListItem;

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
