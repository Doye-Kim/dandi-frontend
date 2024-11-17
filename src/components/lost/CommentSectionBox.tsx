import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { CommentData } from '@/types/lost';
import CommentHeader from '@/components/lost/CommentHeader';
import CommentList from '@/components/lost/CommentList';

interface CommentSectionBoxProps {
  type: 'SOS' | 'PICKUP';
  memberId: number;
  onReply: (commentId: number) => void;
  comments: CommentData[];
  parentId: number | null;
}

const CommentSectionBox = ({
  memberId,
  comments,
  onReply,
  parentId,
}: CommentSectionBoxProps) => {
  return (
    <Container>
      <CommentHeader />
      <CommentList
        memberId={memberId}
        comments={comments}
        onReply={onReply}
        parentId={parentId}
      />
    </Container>
  );
};

export default CommentSectionBox;

const Container = styled.View``;
