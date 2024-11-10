import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { responsive } from '@/utils/common';

interface PhotoBoxProps {
  imgSrc: string;
  width: number;
  height: number;
}

const PhotoBox = ({ imgSrc, width, height }: PhotoBoxProps) => {
  return (
    <Container width={width} height={height}>
      <Image
        source={{ uri: imgSrc }}
        style={{
          width: width,
          height: height,
          borderRadius: 10,
        }}
      />
    </Container>
  );
};

export default PhotoBox;

const Container = styled.View<{ width: number; height: number }>`
  align-items: center; // todo: 사진 삽입시 지워질 예정
  justify-content: center; // todo: 사진 삽입시 지워질 예정
  width: ${({ width }) => responsive(width)}px;
  height: ${({ height }) => responsive(height)}px;
  border-radius: 30px;
`;
