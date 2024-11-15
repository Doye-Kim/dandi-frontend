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
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;
