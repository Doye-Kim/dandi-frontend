import styled from 'styled-components/native';
import CustomText from '@/components/common/CustomText';
import { colors } from '@/constants';
import { responsive, responsiveVertical } from '@/utils';

const TitleText = styled(CustomText)`
  color: ${colors.BLACK};
  font-size: ${responsive(24)}px;
  margin-vertical: ${responsiveVertical(20)}px;
`;

export { TitleText };
