import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import { AlertListData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';

interface AlertListItemProps {
  data: AlertListData;
  isSelectMode: boolean;
  isSelected: boolean;
  handleSelect: () => void;
  handleLongPress: () => void;
  goToDetail: () => void;
}

const AlertListItem = ({
  data,
  isSelectMode,
  isSelected,
  handleSelect,
  handleLongPress,
  goToDetail,
}: AlertListItemProps) => {
  return (
    <CardContainer
      isSelected={isSelected}
      onPress={!isSelectMode ? goToDetail : handleSelect}
      onLongPress={handleLongPress}>
      <AlertHeader>
        <EmojiBox>
          <CustomText>👀</CustomText>
        </EmojiBox>
        <TitleBox>
          <CustomText style={{ color: colors.PRIMARY }}>
            {data.type === 'lostItem' ? '습득물' : '분실물'}
          </CustomText>
        </TitleBox>
        <TimeBox>
          <CustomText
            style={{
              color: colors.GRAY_500,
              fontSize: responsive(10),
            }}>
            {data.date.slice(5, 10)}
          </CustomText>
        </TimeBox>
      </AlertHeader>
      <AlertContent>
        <BlankBox />
        <AlertContentText>{data.title}</AlertContentText>
      </AlertContent>
    </CardContainer>
  );
};

export default AlertListItem;

const CardContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  background-color: ${({ isSelected }) =>
    !isSelected ? colors.WHITE : colors.SELECTED_BLUE};
  padding: ${responsive(16)}px;
`;

const AlertHeader = styled.View`
  flex-direction: row;
  margin-bottom: ${responsive(4)}px;
`;

const EmojiBox = styled.View`
  flex: 1;
`;

const TitleBox = styled.View`
  flex: 7;
`;

const TimeBox = styled.View`
  flex: 2;
  align-items: flex-end;
`;

const AlertContent = styled.View`
  flex: 1;
  flex-direction: row;
`;

const BlankBox = styled.View`
  flex: 1;
`;

const AlertContentText = styled(CustomText)`
  flex: 9;
  color: ${colors.GRAY_900};
`;
