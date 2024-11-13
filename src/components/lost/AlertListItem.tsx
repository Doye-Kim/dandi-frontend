import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import { AlertData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';

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
      onLongPress={handleLongPress}>
      <AlertHeader>
        <EmojiBox>
          <CustomText>👀</CustomText>
        </EmojiBox>
        <TitleBox>
          <CustomText style={{ color: colors.PRIMARY }}>
            {data.foundItemId ? '습득물' : data.commentId ? '댓글' : '분실물'}
          </CustomText>
        </TitleBox>
        <TimeBox>
          <CustomText
            style={{
              color: colors.GRAY_500,
              fontSize: responsive(10),
            }}>
            {data.createdAt.slice(5, 10)}
          </CustomText>
        </TimeBox>
      </AlertHeader>
      <AlertContent>
        <BlankBox />
        {data.commentId ? (
          <AlertContentText>
            {data.title === 'foundComment'
              ? '내가 신고한 분실물에 댓글이 달렸어요!'
              : '내가 등록한 SOS에 댓글이 달렸어요!'}
          </AlertContentText>
        ) : (
          <AlertContentText>{data.title}</AlertContentText>
        )}
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
