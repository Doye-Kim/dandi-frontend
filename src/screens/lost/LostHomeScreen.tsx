import CustomText from '@/components/common/CustomText';
import { colors } from '@/constants';
import styled from 'styled-components/native';

const LostMainScreen = () => {
  return (
    <Container>
      <CustomText style={{ color: colors.BLACK }}>lost main</CustomText>
    </Container>
  );
};

export default LostMainScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;
