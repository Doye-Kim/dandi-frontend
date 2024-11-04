import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import CustomText from '@/components/common/CustomText';
import CommentIcon from '@/assets/icons/comment.svg';

const CommentHeader = () => {
  return (
    <Container>
      <EmojiBox>
        <CommentIcon width={responsive(18)} height={responsive(18)} />
      </EmojiBox>
      <SubtitleBox>
        <SubtitleText>댓글</SubtitleText>
      </SubtitleBox>
      <BlankBox />
    </Container>
  );
};

export default CommentHeader;

const Container = styled.View`
  padding: ${responsive(8)}px;
  border-top-width: 4px;
  border-top-color: ${colors.GRAY_400};
  boder-top-width: 1px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.GRAY_300};
  flex-direction: row;
`;

const EmojiBox = styled.View`
  flex: 1;
  align-items: center;
`;

const SubtitleBox = styled.View`
  flex: 8;
`;

const SubtitleText = styled(CustomText)`
  color: ${colors.BLACK};
`;

const BlankBox = styled.View`
  flex: 1;
`;
