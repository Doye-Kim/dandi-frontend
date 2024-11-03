import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import CustomText from '../common/CustomText';
import HeaderText from '../common/HeaderText';

const ThingsHeader = () => {
  return (
    <StyledHeader>
      <HeaderText>내 소지품</HeaderText>
      <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
        <CustomText
          style={{
            fontSize: 15,
          }}>
          편집
        </CustomText>
      </TouchableOpacity>
    </StyledHeader>
  );
};

export default ThingsHeader;

const StyledHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 70px;
`;
