import React from 'react';
import styled from 'styled-components/native';
import CommentHeader from '@/components/lost/CommentHeader';
import CommentList from '@/components/lost/CommentList';
import CommentInputBox from '@/components/lost/CommentInputBox';

const CommentSectionBox = () => {
  return (
    <Container>
      <CommentHeader />
      <CommentList />
    </Container>
  );
};

export default CommentSectionBox;

const Container = styled.View``;
