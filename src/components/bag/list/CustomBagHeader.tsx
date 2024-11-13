import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { AddFolderIcon, LeftIcon } from '@/assets/icons';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import HeaderText from '@/components/common/HeaderText';
import CustomModal from '@/components/common/CustomModal';
import BagListModal from '../modal/BagListModal';
import InputModal from '../../common/InputModal';

const CustomBagHeader = () => {
  const [isOpenAddBag, setIsOpenAddBag] = useState(false);
  const [isOpenBagList, setIsOpenBagList] = useState(false);
  const [isOpenBagName, setIsOpenBagName] = useState(false);
  const [copyBagId, setCopyBagId] = useState<number | null>(null);

  const navigation = useNavigation<NavigationProp<BagStackParamList>>();

  const openAddBagModal = () => setIsOpenAddBag(true);
  const closeModal = () => {
    setIsOpenAddBag(false);
    setIsOpenBagList(false);
    setIsOpenBagName(false);
  };

  const handleMakeCopyBag = () => {
    setIsOpenAddBag(false);
    setIsOpenBagList(true);
  };

  const handleMakeBag = () => {
    setIsOpenAddBag(false);
    setIsOpenBagList(false);
    setIsOpenBagName(true);
  };

  const handleFetchMakeBag = () => {
    setIsOpenBagName(false);
    setCopyBagId(null);
  };

  return (
    <StyledHeader>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <LeftIcon width={25} height={25} />
      </TouchableOpacity>
      <HeaderText>나만의 가방 목록</HeaderText>
      <TouchableOpacity onPress={openAddBagModal}>
        <AddFolderIcon width={25} height={25} />
      </TouchableOpacity>

      <CustomModal
        visible={isOpenAddBag}
        category='MAKE_CUSTOM_BAG'
        onClose={closeModal}
        onCancel={handleMakeBag}
        onConfirm={handleMakeCopyBag}
      />

      <BagListModal
        visible={isOpenBagList}
        copyBagId={copyBagId}
        setCopyBagId={setCopyBagId}
        onClose={() => setIsOpenBagList(false)}
        onConfirm={handleMakeBag}
      />

      <InputModal
        visible={isOpenBagName}
        onClose={() => setIsOpenBagName(false)}
        onConfirm={handleFetchMakeBag}
        {...(copyBagId !== null && { copyBagId })}
      />
    </StyledHeader>
  );
};

export default CustomBagHeader;

const StyledHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 10px;
`;
