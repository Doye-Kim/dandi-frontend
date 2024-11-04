import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { CommentData } from '@/types/lost';
import CommentListItem from '@/components/lost/CommentListItem';

const CommentList = () => {
  const [comments, setComments] = useState<CommentData[]>([
    { id: 1, nickname: '김짱', content: '안녕안녕1', date: '2024.10.20 18:50' },
    { id: 2, nickname: '윤짱', content: '안녕안녕2', date: '2024.10.20 18:52' },
    { id: 3, nickname: '홍짱', content: '안녕안녕3', date: '2024.10.20 18:54' },
  ]);
  // todo: API 연동 후 데이터 받아오기
  useEffect(() => {
    console.log(comments);
  }, [comments]);

  return (
    <FlatList
      data={comments}
      renderItem={({ item }) => <CommentListItem comment={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default CommentList;
