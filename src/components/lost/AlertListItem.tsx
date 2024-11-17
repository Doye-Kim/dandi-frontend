import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import { AlertData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';
import { convertTimeFormat } from '@/utils/date';

interface AlertListItemProps {
  data: AlertData;
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
      onLongPress={handleLongPress}
      isRead={data.confirmation}>
      <AlertHeader>
        <EmojiBox>
          {data.commentId ? (
            <CustomText>🔔</CustomText>
          ) : data.foundItemId ? (
            <CustomText>👀</CustomText>
          ) : (
            <CustomText>🚨</CustomText>
          )}
        </EmojiBox>
        <TitleBox>
          <CustomText style={{ color: colors.PRIMARY }}>
            {data.foundItemId ? '습득물' : data.commentId ? '댓글' : '분실물'}
          </CustomText>
        </TitleBox>
        <TimeBox>
          <TimeText>{`${data.createdAt.slice(5, 7)}월 ${data.createdAt.slice(
            8,
            10,
          )}일`}</TimeText>
          <TimeText>{convertTimeFormat(data.createdAt)}</TimeText>
        </TimeBox>
      </AlertHeader>
      <AlertContent>
        <BlankBox />
        {data.commentId ? (
          <AlertContentText>새로운 댓글 알림이 있어요!</AlertContentText>
        ) : (
          <AlertContentText>{data.title}</AlertContentText>
        )}
      </AlertContent>
    </CardContainer>
  );
};

export default AlertListItem;

const CardContainer = styled.TouchableOpacity<{
  isSelected: boolean;
  isRead: boolean;
}>`
  flex: 1;
  background-color: ${({ isSelected, isRead }) =>
    isSelected
      ? colors.SELECTED_BLUE
      : isRead
      ? colors.GRAY_300
      : colors.WHITE};
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
  flex: 3;
  align-items: flex-end;
`;

const TimeText = styled(CustomText)`
  color: ${colors.GRAY_500};
  font-size: ${responsive(10)}px;
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
