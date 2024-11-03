import styled from 'styled-components/native';
import { BagTrashIcon, PlusThingsIcon, RefreshIcon } from '@/assets/icons';
import { colors } from '@/constants';
import CustomText from '../common/CustomText';
import { responsive } from '@/utils';
import useBagStore from '@/store/useBagStore';

const BagActionBar = () => {
  const mode = useBagStore((state) => state.mode);
  return (
    <StyleBarContainer mode={mode}>
      {mode === 3 && (
        <ButtonContainer>
          <RefreshIcon width={15} height={15} />
          <CustomText
            style={{ color: colors.GRAY_700, fontSize: 15, marginLeft: 5 }}>
            현재 가방에 적용
          </CustomText>
        </ButtonContainer>
      )}

      {mode === 2 && (
        <ButtonContainer>
          <BagTrashIcon width={15} height={15} />
          <CustomText
            style={{ color: colors.GRAY_700, fontSize: 15, marginLeft: 5 }}>
            모두 서랍으로 이동
          </CustomText>
        </ButtonContainer>
      )}

      <ButtonContainer>
        <PlusThingsIcon width={20} height={20} />
        <CustomText style={{ color: colors.PRIMARY, fontSize: 15 }}>
          추가하기
        </CustomText>
      </ButtonContainer>
    </StyleBarContainer>
  );
};

export default BagActionBar;

const StyleBarContainer = styled.View<{ mode: number }>`
  flex-direction: row;
  justify-content: ${({ mode }) => (mode === 1 ? 'flex-end' : 'space-between')};
  align-items: center;
  padding: ${responsive(10)}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
