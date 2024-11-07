import React from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import CustomText from '@/components/common/CustomText';
import { colors } from '@/constants';
import { responsive } from '@/utils';

const RouteListItem = () => {
  return (
    <Container>
      <RouteBox>
        <RouteText>경상남도 거제시 중곡로 42</RouteText>
        <RouteText>- 부산광역시 강서구 녹산산단로 72</RouteText>
      </RouteBox>
      <TimeText>18:30 - 20:00</TimeText>
    </Container>
  );
};

export default RouteListItem;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${responsive(16)}px;
  background-color: ${colors.GRAY_300};
`;

const RouteBox = styled.View``;

const RouteText = styled(CustomText)``;

const TimeText = styled(CustomText)`
  align-self: flex-end;
  font-size: ${responsive(10)}px;
  color: ${colors.GRAY_600};
`;
