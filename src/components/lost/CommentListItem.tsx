import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { CommentData } from '@/types/lost';
import { convertDateTimeFormat } from '@/utils/date';
import useUserStore from '@/store/useUserStore';
import CustomText from '@/components/common/CustomText';

interface CommentListItemProps {
  type: 'SOS' | 'PICKUP';
  onReply: (commentId: number) => void;
  comment: CommentData;
}

const CommentListItem = ({ type, comment, onReply }: CommentListItemProps) => {
  // 게시글 작성자와 댓글 작성자가 같은지 확인
  const { id: userId } = useUserStore();

  return (
    <Container>
      <BlankBox />
      <ContentContainer>
        <HeaderContainer>
          <WriterNameText isArticleWriter={userId === comment.writerId}>
            {`닉네임`}
            {userId === comment.writerId ? '(작성자)' : ''}
          </WriterNameText>
          <ReplyBox onPress={() => onReply(comment.id)}>
            <ReplyText>대댓글</ReplyText>
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
