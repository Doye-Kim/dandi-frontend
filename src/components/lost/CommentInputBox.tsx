import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils/common';
import { InputButtonIcon } from '@/assets/icons';
import { registerPickupComment, registerSOSComment } from '@/api/lost';
import { showCustomErrorToast } from '@/utils/toast';

interface CommentInputBoxProps {
  type: 'SOS' | 'PICKUP';
  articleId: number;
  parentId: number | null;
  onCommentSubmit: () => void;
}

const CommentInputBox = ({
  type,
  articleId,
  parentId,
  onCommentSubmit,
}: CommentInputBoxProps) => {
  const [comment, setComment] = useState('');
  const [isComment, setIsComment] = useState(false);

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      showCustomErrorToast('댓글을 입력해주세요.');
      return;
    }

    try {
      if (type === 'PICKUP') {
        await registerPickupComment(articleId, parentId, comment);
      } else if (type === 'SOS') {
        await registerSOSComment(articleId, parentId, comment);
      }
      setComment('');
      onCommentSubmit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <InputBox
        placeholder={parentId ? '대댓글을 입력하세요.' : '댓글을 입력하세요.'}
        placeholderTextColor={colors.GRAY_400}
        value={comment}
        onChangeText={(text) => setComment(text)}
        onFocus={() => setIsComment(true)}
        onBlur={() => setIsComment(false)}
      />
      <InputButton onPress={handleSubmitComment}>
        <InputButtonIcon width={responsive(40)} height={responsive(40)} />
      </InputButton>
    </Container>
  );
};

export default CommentInputBox;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 20px;
  padding: ${responsive(10)}px;
  border-top-width: 1px;
  border-top-color: ${colors.GRAY_400};
`;

const InputBox = styled.TextInput`
  width: 80%;
  height: ${responsive(40)}px;
  padding-left: 10px;
  border: 1px solid ${colors.GRAY_400};
  border-radius: 10px;
  font-size: ${responsive(14)}px;
  font-family: 'OAGothic-Medium';
`;

const InputButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 10%;
  height: ${responsive(40)}px;
`;
