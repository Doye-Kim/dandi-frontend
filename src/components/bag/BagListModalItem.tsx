import styled from 'styled-components/native';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { BagItem } from './MainBagList';
import CustomText from '../common/CustomText';

interface BagListModalItemProps {
  item: BagItem;
  copyBagId: number | null;
  setCopyBagId: (copyBagId: number) => void;
}

const BagListModalItem = ({
  item,
  copyBagId,
  setCopyBagId,
}: BagListModalItemProps) => {
  const isSelected = copyBagId !== null && copyBagId === item.id;

  return (
    <StyleContainer onPress={() => setCopyBagId(item.id)} selected={isSelected}>
      <StyledText selected={isSelected}>{item.name}</StyledText>
    </StyleContainer>
  );
};

export default BagListModalItem;

const StyleContainer = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 15px;
  border-radius: 20px;
  border-width: ${({ selected }) => (selected ? '2px' : '1px')};
  border-color: ${({ selected }) =>
    selected ? colors.PRIMARY : colors.GRAY_500};
  margin: 5px;
  width: ${responsive(320)}px;
`;

const StyledText = styled(CustomText)<{ selected: boolean }>`
  font-size: 16px;
  color: ${({ selected }) => (selected ? colors.PRIMARY : colors.GRAY_900)};
`;
