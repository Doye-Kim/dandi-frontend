import styled from 'styled-components/native';
import CustomText from './CustomText';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  style: 'enable' | 'disable' | 'gray';
  width?: number;
  height?: number;
  padding?: number;
  fontSize?: number;
}

const CustomButton = ({
  title,
  onPress,
  style,
  width = 352, // 기본 너비
  height = 60, // 기본 높이
  padding = 10, // 기본 패딩
  fontSize = 16, // 기본 폰트 크기
}: CustomButtonProps) => {
  const ButtonComponent = style === 'enable' ? EnableButton : DisableButton;
  const TextComponent =
    style === 'enable'
      ? EnableButtonText
      : style === 'disable'
      ? DisableButtonText
      : GrayButtonText;

  return (
    <ButtonComponent
      onPress={onPress}
      width={responsive(width)}
      height={responsiveVertical(height)}
      padding={responsive(padding)}>
      <TextComponent fontSize={responsive(fontSize)}>{title}</TextComponent>
    </ButtonComponent>
  );
};

// 스타일 컴포넌트
const StyledButton = styled.TouchableOpacity<{
  width: number;
  height: number;
  padding: number;
}>`
  border-radius: ${responsive(20)}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: ${({ padding }) => padding}px;
  margin-vertical: ${responsiveVertical(5)}px;
  justify-content: center;
  align-items: center;
`;

const EnableButton = styled(StyledButton)`
  background-color: ${colors.PRIMARY};
`;
const DisableButton = styled(StyledButton)`
  background-color: ${colors.GRAY_500};
`;

const EnableButtonText = styled(CustomText)<{ fontSize: number }>`
  color: ${colors.WHITE};
  font-size: ${({ fontSize }) => fontSize}px;
`;

const DisableButtonText = styled(CustomText)<{ fontSize: number }>`
  color: ${colors.GRAY_700};
  font-size: ${({ fontSize }) => fontSize}px;
`;

const GrayButtonText = styled(CustomText)<{ fontSize: number }>`
  color: ${colors.GRAY_900};
  font-size: ${({ fontSize }) => fontSize}px;
`;

export default CustomButton;
