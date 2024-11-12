import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { CommentData } from '@/types/lost';
import CommentListItem from '@/components/lost/CommentListItem';
import ReplyListItem from './ReplyListItem';

interface CommentListProps {
  type: 'SOS' | 'PICKUP';
  articleId: number;
  onReply: (commentId: number) => void;
  comments: CommentData[];
}

const CommentList = ({
  type,
  articleId,
  comments,
  onReply,
}: CommentListProps) => {
  return (
    <FlatList
      data={comments}
      renderItem={({ item }) =>
        item.parentId === null ? (
          <CommentListItem type={type} comment={item} onReply={onReply} />
        ) : (
          <ReplyListItem reply={item} />
        )
      }
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default CommentList;
