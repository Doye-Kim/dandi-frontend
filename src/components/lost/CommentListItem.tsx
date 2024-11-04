import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { CommentData } from '@/types/lost';
import CustomText from '@/components/common/CustomText';
import ReplyList from '@/components/lost/ReplyList';

interface CommentListItemProps {
  comment: CommentData;
}

const CommentListItem = ({ comment }: CommentListItemProps) => {
  const [replies, setReplies] = useState([
    {
      id: 1,
      nickname: '송짱',
      content: '아니?',
      date: '2024.10.20 19:00',
    },
    {
      id: 2,
      nickname: '권짱',
      content: '아닌데?',
      date: '2024.10.20 19:04',
    },
    {
      id: 3,
      nickname: '이짱',
      content: '아닌데요?',
      date: '2024.10.20 19:10',
    },
  ]);

  // todo: API 연동 후 데이터 받아오기
  useEffect(() => {
    console.log('대댓글');
  }, [replies]);
  // todo: 대댓글 버튼 API 연동
  const writeReply = () => {
    console.log('write reply');
  };
  // todo: 작성자 확인 후 작성자일 경우 표시
  const isArticleWriter = (id: number) => {
    return id == 1;
  };

  return (
    <>
      <Container>
        <BlankBox />
        <ContentContainer>
          <HeaderContainer>
            <WriterNameText isArticleWriter={isArticleWriter(comment.id)}>
              {comment.nickname}
              {isArticleWriter(comment.id) ? '(작성자)' : ''}
            </WriterNameText>
            <ReplayText onPress={writeReply}>대댓글</ReplayText>
          </HeaderContainer>
          <ContentText>{comment.content}</ContentText>
          <DateText>{comment.date}</DateText>
        </ContentContainer>
        <BlankBox />
      </Container>
      <ReplyList replies={replies} />
    </>
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

const ReplayText = styled(CustomText)`
  color: ${colors.GRAY_500};
`;

const ContentText = styled(CustomText)`
  font-size: ${responsive(14)}px;
`;

const BlankBox = styled.View`
  flex: 1;
`;
