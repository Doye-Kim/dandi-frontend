import React from 'react';
import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils/common';
import CustomText from '@/components/common/CustomText';

interface InfoSectionBoxProps {
  emoji: React.ReactNode;
  subtitle: string;
  content?: string;
  children?: React.ReactNode;
}

const InfoSectionBox = ({
  emoji,
  subtitle,
  content,
  children,
}: InfoSectionBoxProps) => {
  return (
    <SectionBox>
      <EmojiBox>{emoji}</EmojiBox>
      <ExplainBox>
        <SubtitleText>{subtitle}</SubtitleText>
        <ContentText>{content}</ContentText>
        {children}
      </ExplainBox>
      <BlankBox />
    </SectionBox>
  );
};

export default InfoSectionBox;

const SectionBox = styled.View`
  flex-direction: row;
  padding: ${responsive(8)}px;
`;

const EmojiBox = styled.View`
  flex: 1;
  align-items: center;
`;

const ExplainBox = styled.View`
  flex: 8;
  gap: ${responsive(8)}px;
`;

const BlankBox = styled.View`
  flex: 1;
`;

const SubtitleText = styled(CustomText)`
  color: ${colors.BLACK};
`;

const ContentText = styled(CustomText)`
  font-size: ${responsive(14)}px;
  color: ${colors.GRAY_900};
`;
