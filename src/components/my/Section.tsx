// Section.tsx
import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import CustomText from '../common/CustomText';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <>
    <TitleText>{title}</TitleText>
    <BorderContainer>{children}</BorderContainer>
  </>
);

export default Section;

const BorderContainer = styled.View`
  border-radius: 20px;
  border-width: 1px;
  padding: 10px;
  border-color: ${colors.GRAY_500};
  margin-bottom: 10px;
`;

const TitleText = styled(CustomText)`
  margin: 10px;
  color: ${colors.BLACK};
  font-size: 18px;
`;
