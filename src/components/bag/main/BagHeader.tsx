import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import CustomText from '../../common/CustomText';
import HeaderText from '../../common/HeaderText';
import useBagStore from '@/store/useBagStore';

const BagHeader = () => {
  const { editMode, setEditMode, setIsEditComplete } = useBagStore();

  const handlePress = () => {
    if (!editMode) setEditMode(true);
    else {
      setIsEditComplete(true);
      setEditMode(false);
    }
  };

  return (
    <StyledHeader>
      <HeaderText>내 소지품</HeaderText>
      <TouchableOpacity
        style={{ position: 'absolute', right: 20 }}
        onPress={handlePress}>
        <CustomText
          style={{
            fontSize: 15,
          }}>
          {editMode ? '완료' : '편집'}
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
