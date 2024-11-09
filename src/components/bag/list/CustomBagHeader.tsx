import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { AddFolderIcon, LeftIcon } from '@/assets/icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BagStackParamList } from '@/navigations/stack/BagStackNavigator';
import HeaderText from '../../common/HeaderText';
import CustomModal from '../modal/CustomModal';
import BagListModal from '../modal/BagListModal';
import BagNameModal from '../modal/BagNameModal';

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
    console.log('Copying bag');
  };

  const handleMakeBag = () => {
    setIsOpenAddBag(false);
    setIsOpenBagList(false);
    setIsOpenBagName(true);
    console.log('Creating empty bag');
  };

  const handleFetchMakeBag = () => {
    console.log('Fetching bag creation');
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

      <BagNameModal
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
