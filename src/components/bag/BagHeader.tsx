import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import CustomText from '../common/CustomText';
import HeaderText from '../common/HeaderText';
import useBagStore from '@/store/useBagStore';

const BagHeader = () => {
  const { mode, setMode } = useBagStore();
  const onPress = () => {
    console.log('press', mode);
    if (mode !== 2) setMode(2);
    // #todo: 편집 완료 처리
    // 나만의 가방 편집 완료 시 setMode(3) 해야 함
    else setMode(1);
  };
  return (
    <StyledHeader>
      <HeaderText>내 소지품</HeaderText>
      <TouchableOpacity
        style={{ position: 'absolute', right: 20 }}
        onPress={onPress}>
        <CustomText
          style={{
            fontSize: 15,
          }}>
          {mode === 1 || mode === 3 ? '편집' : '완료'}
        </CustomText>
      </TouchableOpacity>
    </StyledHeader>
  );
};

export default BagHeader;

const StyledHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 70px;
`;
