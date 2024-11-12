import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LeftIcon } from '@/assets/icons';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import HeaderText from '@/components/common/HeaderText';
import CustomModal from '@/components/common/CustomModal';

const CustomItemHeader = ({ itemId }: { itemId?: number }) => {
  const navigation = useNavigation<NavigationProp<BagStackParamList>>();
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);

  const handlePressDelete = () => {
    setIsOpenDelete(true);
    console.log('press delete');
  };

  const handleDelete = () => {
    console.log('delete');
  };
  const isEdit = itemId ? true : false;
  return (
    <StyledHeader isEdit={isEdit}>
      <TouchableOpacity
        style={{ position: 'absolute', left: 20 }}
        onPress={() => navigation.goBack()}>
        <LeftIcon width={25} height={25} />
      </TouchableOpacity>
      <HeaderText>{itemId ? '소지품 수정' : '소지품 추가'}</HeaderText>

      <CustomModal
        visible={isOpenDelete}
        category='DELETE_ITEM'
        onClose={() => setIsOpenDelete(false)}
        onCancel={() => setIsOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </StyledHeader>
  );
};

export default CustomItemHeader;

const StyledHeader = styled.View<{ isEdit: boolean }>`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 70px;
  padding: 0 10px;
`;
