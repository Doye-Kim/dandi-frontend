import React from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import { InputButtonIcon } from '@/assets/icons';

interface ReplyCommentInputProps {
  type: 'SOS' | 'PICKUP';
  parentId: number;
}

const ReplyCommentInput = ({ type, parentId }: ReplyCommentInputProps) => {
  const [comment, setComment] = useState('');
  const [isComment, setIsComment] = useState(false);

  return (
    <Container>
      <InputBox
        placeholder='댓글을 작성해주세요'
        placeholderTextColor={colors.GRAY_400}
        value={comment}
        onChangeText={(text) => setComment(text)}
        onFocus={() => setIsComment(true)}
        onBlur={() => setIsComment(false)}
      />
      <InputButton onPress={() => {}}>
        <InputButtonIcon width={responsive(40)} height={responsive(40)} />
      </InputButton>
    </Container>
  );
};

export default ReplyCommentInput;

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
