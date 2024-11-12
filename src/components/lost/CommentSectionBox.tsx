import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { CommentData } from '@/types/lost';
import CommentHeader from '@/components/lost/CommentHeader';
import CommentList from '@/components/lost/CommentList';

interface CommentSectionBoxProps {
  type: 'SOS' | 'PICKUP';
  articleId: number;
  onReply: (commentId: number) => void;
  comments: CommentData[];
}

const CommentSectionBox = ({
  type,
  articleId,
  comments,
  onReply,
}: CommentSectionBoxProps) => {
  return (
    <Container>
      <CommentHeader />
      <CommentList
        type={type}
        articleId={articleId}
        comments={comments}
        onReply={onReply}
      />
    </Container>
  );
};

export default CommentSectionBox;

const Container = styled.View``;
