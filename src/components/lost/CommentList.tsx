import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { CommentData } from '@/types/lost';
import CommentListItem from '@/components/lost/CommentListItem';
import ReplyListItem from './ReplyListItem';

interface CommentListProps {
  memberId: number;
  onReply: (commentId: number) => void;
  comments: CommentData[];
}

const CommentList = ({ memberId, comments, onReply }: CommentListProps) => {
  return (
    <FlatList
      data={comments}
      renderItem={({ item }) =>
        item.parentId === null ? (
          <CommentListItem
            memberId={memberId}
            comment={item}
            onReply={onReply}
          />
        ) : (
          <ReplyListItem reply={item} memberId={memberId} />
        )
      }
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default CommentList;
