import styled from 'styled-components/native';
import CustomText from '../common/CustomText';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';

const AuthButton = ({
  title,
  onPress,
  style,
}: {
  title: string;
  onPress: () => void;
  style: string;
}) =>
  style === 'enable' ? (
    <EnableButton onPress={onPress}>
      <EnableButtonText>{title}</EnableButtonText>
    </EnableButton>
  ) : style === 'disable' ? (
    <DisableButton>
      <DisableButtonText>{title}</DisableButtonText>
    </DisableButton>
  ) : (
    <DisableButton onPress={onPress}>
      <GrayButtonText>{title}</GrayButtonText>
    </DisableButton>
  );
const StyledButton = styled.TouchableOpacity`
  padding: ${responsive(10)}px;
  border-radius: ${responsive(20)}px;
  width: ${responsive(352)}px;
  height: ${responsiveVertical(60)}px;
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

const EnableButtonText = styled(CustomText)`
  color: ${colors.WHITE};
  font-size: ${responsive(16)}px;
`;

const DisableButtonText = styled(CustomText)`
  color: ${colors.GRAY_700};
  font-size: ${responsive(16)}px;
`;
const GrayButtonText = styled(CustomText)`
  color: ${colors.GRAY_900};
  font-size: ${responsive(16)}px;
`;
export default AuthButton;
