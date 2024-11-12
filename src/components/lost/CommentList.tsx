import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { CommentData } from '@/types/lost';
import CommentListItem from '@/components/lost/CommentListItem';
import ReplyListItem from './ReplyListItem';

interface CommentListProps {
  type: 'SOS' | 'PICKUP';
  id: number;
  comments: CommentData[];
}

const CommentList = ({ type, id, comments }: CommentListProps) => {
  return (
    <FlatList
      data={comments}
      renderItem={({ item }) =>
        item.parentId === null ? (
          <CommentListItem type={type} comment={item} />
        ) : (
          <ReplyListItem reply={item} />
        )
      }
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default CommentList;
