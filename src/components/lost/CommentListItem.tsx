import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { CommentData } from '@/types/lost';
import { convertDateTimeFormat } from '@/utils/date';
import CustomText from '@/components/common/CustomText';

interface CommentListItemProps {
  onReply: (commentId: number) => void;
  comment: CommentData;
  memberId: number;
  parentId: number | null;
}

const CommentListItem = ({
  comment,
  onReply,
  memberId,
  parentId,
}: CommentListItemProps) => {
  const isReply = comment.id === parentId;

  return (
    <Container>
      <BlankBox />
      <ContentContainer>
        <HeaderContainer>
          <WriterNameText isArticleWriter={memberId === comment.writerId}>
            {memberId === comment.writerId ? '익명(작성자)' : comment.nickname}
          </WriterNameText>
          <ReplyBox onPress={() => onReply(comment.id)}>
            <ReplyText>{isReply ? '취소' : '대댓글'}</ReplyText>
          </ReplyBox>
        </HeaderContainer>
        <ContentText>{comment.content}</ContentText>
        <DateText>
          {convertDateTimeFormat(new Date(comment.createdAt))}
        </DateText>
      </ContentContainer>
      <BlankBox />
    </Container>
  );
};

export default CommentListItem;

const Container = styled.View`
  flex-direction: row;
  padding-vertical: ${responsiveVertical(8)}px;
`;

const ContentContainer = styled.View`
  flex: 8;
  gap: ${responsive(2)}px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const WriterNameText = styled(CustomText)<{ isArticleWriter: boolean }>`
  color: ${(props) => (props.isArticleWriter ? colors.ACCENT_BLUE : '')};
`;

const DateText = styled(CustomText)`
  font-size: ${responsive(8)}px;
  color: ${colors.GRAY_500};
`;

const ReplyBox = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-end;
`;

const ReplyText = styled(CustomText)`
  color: ${colors.GRAY_500};
`;

const ContentText = styled(CustomText)`
  font-size: ${responsive(14)}px;
`;

const BlankBox = styled.View`
  flex: 1;
`;
