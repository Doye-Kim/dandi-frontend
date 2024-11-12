import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { CommentData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';
import ReplyCommentInput from '@/components/lost/ReplyCommentInput';

interface CommentListItemProps {
  type: 'SOS' | 'PICKUP';
  comment: CommentData;
}

const CommentListItem = ({ type, comment }: CommentListItemProps) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const isArticleWriter = (id: number) => {
    return id == 1;
  };

  return (
    <Container>
      <BlankBox />
      <ContentContainer>
        <HeaderContainer>
          <WriterNameText isArticleWriter={isArticleWriter(comment.writerId)}>
            {`닉네임(임시)`}
            {isArticleWriter(comment.writerId) ? '(작성자)' : ''}
          </WriterNameText>
          <ReplyBox onPress={() => setIsReplyOpen((prev) => !prev)}>
            <ReplyText>대댓글</ReplyText>
          </ReplyBox>
        </HeaderContainer>
        <ContentText>{comment.content}</ContentText>
        <DateText>{comment.createdAt}</DateText>
        {isReplyOpen && <ReplyCommentInput type={type} parentId={comment.id} />}
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
