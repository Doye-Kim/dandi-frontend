import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { DeleteBagIcon, BagBurgerIcon } from '@/assets/icons';
import { colors } from '@/constants';
import { responsive } from '@/utils';
import { BagProps } from '@/api/bag';
import { useDeleteBagMutation } from '@/queries/bagQueries';
import CustomText from '@/components/common/CustomText';
import CustomModal from '@/components/common/CustomModal';
import InputModal from '../../common/InputModal';

const BagListItem = ({ item, drag }: { item: BagProps; drag: () => void }) => {
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isOpenBagName, setIsOpenBagName] = useState<boolean>(false);

  const handlePressDelete = () => {
    setIsOpenDelete(true);
  };

  const handleDragStart = () => {
    drag();
  };
  const deleteMutation = useDeleteBagMutation();
  const handleDeleteBag = () => {
    deleteMutation.mutate(item.id);
    setIsOpenDelete(false);
  };
  const handlePressTitle = () => {
    setIsOpenBagName(true);
  };

  const handleEditBagName = () => {
    setIsOpenBagName(false);
  };

  return (
    <Container>
      <TouchableOpacity onPress={handlePressDelete}>
        <DeleteBagIcon width={25} height={25} />
      </TouchableOpacity>
      <StyleTitleContainer>
        <TouchableOpacity onPress={handlePressTitle}>
          <CustomText style={{ fontSize: 18 }}>{item.name}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity onLongPress={handleDragStart}>
          <BagBurgerIcon />
        </TouchableOpacity>
      </StyleTitleContainer>
      {isOpenDelete && (
        <CustomModal
          visible={isOpenDelete}
          category='DELETE_BAG'
          onClose={() => setIsOpenDelete(false)}
          onCancel={() => setIsOpenDelete(false)}
          onConfirm={handleDeleteBag}
          name={item.name}
        />
      )}
      {isOpenBagName && (
        <InputModal
          visible={isOpenBagName}
          onClose={() => setIsOpenBagName(false)}
          onConfirm={handleEditBagName}
          bagId={item.id}
          name={item.name}
        />
      )}
    </Container>
  );
};

export default BagListItem;

const Container = styled.View`
  flex-direction: row;
  margin: 10px;
  align-items: center;
`;

const StyleTitleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  margin-horizontal: ${responsive(5)}px;
  border-width: 1px;
  border-color: ${colors.GRAY_300};
`;
