import React from 'react';
import { useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { CommentData } from '@/types/lost';
import ReplyListItem from '@/components/lost/ReplyListItem';

interface ReplyListProps {
  replies: CommentData[];
}

const ReplyList = ({ replies }: ReplyListProps) => {
  useEffect(() => {
    console.log('ReplayList');
  });

  return (
    <FlatList
      data={replies}
      renderItem={({ item }) => <ReplyListItem reply={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ReplyList;

const Container = styled.View``;
