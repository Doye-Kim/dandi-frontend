import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import { CommentData } from '@/types/lost';
import { convertDateTimeFormat } from '@/utils/date';
import useUserStore from '@/store/useUserStore';
import CustomText from '@/components/common/CustomText';

interface ReplyListItemProps {
  reply: CommentData;
}

const ReplyListItem = ({ reply }: ReplyListItemProps) => {
  // todo: 게시글 작성자와 댓글 작성자가 같은지 확인
  const { id: userId } = useUserStore();

  return (
    <Container>
      <FowardBlankBox />
      <ContentContainer>
        <HeaderContainer>
          <WriterNameText>닉네임(임시)</WriterNameText>
          <WriterNameText>{userId}</WriterNameText>
          <WriterNameText>{reply.writerId}</WriterNameText>
        </HeaderContainer>
        <ContentText>{reply.content}</ContentText>
        <DateText>{convertDateTimeFormat(new Date(reply.createdAt))}</DateText>
      </ContentContainer>
      <BlankBox />
    </Container>
  );
};

export default ReplyListItem;

const Container = styled.View`
  flex-direction: row;
  gap: ${responsive(2)}px;
`;

const ContentContainer = styled.View`
  flex: 10;
  padding: ${responsive(10)}px;
  background-color: ${colors.GRAY_300};
  gap: ${responsive(2)}px;
  border: 0.5px solid ${colors.GRAY_400};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
`;

const WriterNameText = styled(CustomText)``;

const DateText = styled(CustomText)`
  font-size: 8px;
  color: ${colors.GRAY_500};
`;

const FowardBlankBox = styled.View`
  flex: 2;
`;

const BlankBox = styled.View`
  flex: 1;
`;

const ContentText = styled(CustomText)`
  font-size: ${responsive(14)}px;
`;
