import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import { convertTimeFormat } from '@/utils/date';
import { LatLon, ResponseRouteListItem } from '@/api/map';
import CustomText from '@/components/common/CustomText';

interface RouteListItemProps {
  isSelectMode: boolean;
  route: ResponseRouteListItem;
  handlePress: (track: LatLon) => void;
  handleLongPress: () => void;
  isSelected: boolean;
}

const RouteListItem = ({
  route,
  handleLongPress,
  handlePress,
  isSelected,
}: RouteListItemProps) => {
  return (
    <Container isSelected={isSelected}>
      <RouteCardBox
        onLongPress={handleLongPress}
        onPress={() => handlePress(route.track[0])}>
        <RouteBox>
          <RouteText>
            {route.track[0].lat.toFixed(2)}, {route.track[0].lon.toFixed(2)}
          </RouteText>
          <RouteText>
            - {route.track[route.track.length - 1].lat.toFixed(2)},
            {route.track[route.track.length - 1].lon.toFixed(2)}
          </RouteText>
        </RouteBox>
        <TimeBox>
          <TimeText>
            {convertTimeFormat(route.createdAt)} -{' '}
            {convertTimeFormat(route.endedAt)}
          </TimeText>
        </TimeBox>
      </RouteCardBox>
    </Container>
  );
};

export default RouteListItem;

const Container = styled.View<{ isSelected: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  padding: ${responsive(14)}px;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.SELECTED_BLUE : colors.GRAY_200};
`;

const RouteCardBox = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const RouteBox = styled.View`
  flex: 7;
  align-items: center;
`;

const TimeBox = styled.View`
  flex: 3;
  align-items: center;
  justify-content: flex-end;
`;

const RouteText = styled(CustomText)``;

const TimeText = styled(CustomText)`
  align-self: flex-end;
  font-size: ${responsive(10)}px;
  color: ${colors.GRAY_600};
`;
