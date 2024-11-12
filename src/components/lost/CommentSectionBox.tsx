import React, { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import { CommentData } from '@/types/lost';
import { getSOSComments, getPickupComments } from '@/api/lost';
import CommentHeader from '@/components/lost/CommentHeader';
import CommentList from '@/components/lost/CommentList';

interface CommentSectionBoxProps {
  type: 'SOS' | 'PICKUP';
  id: number;
  comments: CommentData[];
}

const CommentSectionBox = ({ type, id, comments }: CommentSectionBoxProps) => {
  return (
    <Container>
      <CommentHeader />
      <CommentList type={type} id={id} comments={comments} />
    </Container>
  );
};

export default CommentSectionBox;

const Container = styled.View``;
