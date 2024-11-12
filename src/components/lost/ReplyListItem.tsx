import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { CommentData } from '@/types/lost';
import { responsive, responsiveVertical } from '@/utils/common';
import CustomText from '@/components/common/CustomText';

interface ReplyListItemProps {
  reply: CommentData;
}

const ReplyListItem = ({ reply }: ReplyListItemProps) => {
  // todo: 작성자 확인 후 작성자일 경우 표시

  return (
    <Container>
      <FowardBlankBox />
      <ContentContainer>
        <HeaderContainer>
          <WriterNameText>{reply.writerId}</WriterNameText>
        </HeaderContainer>
        <ContentText>{reply.content}</ContentText>
        <DateText>{reply.createdAt}</DateText>
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
