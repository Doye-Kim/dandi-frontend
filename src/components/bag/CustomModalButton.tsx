import { TouchableOpacity } from 'react-native';
import CustomText from '../common/CustomText';
import styled from 'styled-components/native';
import { responsive, responsiveVertical } from '@/utils';
import { colors } from '@/constants';

const CustomModalButton = ({
  text,
  isEnabled,
  onPress,
}: {
  text: string;
  isEnabled: boolean;
  onPress: () => void;
}) => {
  return (
    <>
      {isEnabled ? (
        <StyleButton onPress={onPress}>
          <StyleText>{text}</StyleText>
        </StyleButton>
      ) : (
        <DisabledButton onPress={onPress}>
          <DisableText>{text}</DisableText>
        </DisabledButton>
      )}
    </>
  );
};

export default CustomModalButton;

const StyleButton = styled.TouchableOpacity`
  width: ${responsive(120)}px;
  height: ${responsiveVertical(40)}px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.PRIMARY};
  border-radius: ${responsive(20)}px;
`;

const StyleText = styled(CustomText)`
  font-size: 18px;
  color: ${colors.WHITE};
`;

const DisabledButton = styled(StyleButton)`
  background-color: ${colors.WHITE};
  border-color: ${colors.PRIMARY};
  border-width: 1px;
`;

const DisableText = styled(StyleText)`
  color: ${colors.PRIMARY};
`;
