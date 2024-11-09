import { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { BagTrashIcon, PlusThingsIcon, RefreshIcon } from '@/assets/icons';
import { bagNavigations, colors } from '@/constants';
import { BagScreenProps } from '@/screens/bag/BagMainScreen';
import { responsive } from '@/utils';
import CustomText from '../../common/CustomText';
import useBagStore from '@/store/useBagStore';

const BagActionBar = ({ navigation }: BagScreenProps) => {
  const editMode = useBagStore((state) => state.editMode);
  const selectBagId = useBagStore((state) => state.selectBagId);
  const defaultBagId = useBagStore((state) => state.defaultBagId);
  const [isDefault, setIsDefault] = useState(selectBagId === defaultBagId);

  useEffect(() => {
    setIsDefault(selectBagId === defaultBagId);
  }, [selectBagId, defaultBagId]);
  const handlePressAdd = () => {
    navigation.navigate(bagNavigations.BAG_ITEM, {});
  };
  return (
    <StyleBarContainer editMode={editMode} isDefault={isDefault}>
      {!editMode && selectBagId !== defaultBagId && (
        <ButtonContainer>
          <RefreshIcon width={12} height={12} />
          <CustomText
            style={{ color: colors.GRAY_700, fontSize: 12, marginLeft: 5 }}>
            현재 가방에 적용
          </CustomText>
        </ButtonContainer>
      )}

      {editMode && (
        <ButtonContainer>
          <BagTrashIcon width={12} height={12} />
          <CustomText
            style={{ color: colors.GRAY_700, fontSize: 12, marginLeft: 5 }}>
            모두 서랍으로 이동
          </CustomText>
        </ButtonContainer>
      )}

      <ButtonContainer onPress={handlePressAdd}>
        <PlusThingsIcon width={15} height={15} />
        <CustomText style={{ color: colors.PRIMARY, fontSize: 12 }}>
          추가하기
        </CustomText>
      </ButtonContainer>
    </StyleBarContainer>
  );
};

export default BagActionBar;

const StyleBarContainer = styled.View<{
  editMode: boolean;
  isDefault: boolean;
}>`
  flex-direction: row;
  justify-content: ${({ editMode, isDefault }) =>
    editMode || !isDefault ? 'space-between' : 'flex-end'};
  align-items: center;
  padding: ${responsive(10)}px;
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 5px;
`;
