import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { getSnapshot, putSnapshot, Snapshot } from '@/api/map';
import { CheckIcon, CrossButton } from '@/assets/icons';
import { colors } from '@/constants';
import { Item } from '@/api/map';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
} from '@/utils';
import CustomText from '../common/CustomText';

const CheckListModal = ({
  visible,
  onDismiss,
  routeId,
  snapshot,
  skip,
  body,
}: {
  visible: boolean;
  onDismiss: () => void;
  routeId?: number;
  snapshot?: Snapshot;
  skip?: string;
  body?: string;
}) => {
  const [items, setItems] = useState<Item[]>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchItems = async (routeId: number) => {
    try {
      const data = await getSnapshot(routeId);
      setItems(data.snapshot.items);
      const initiallySelected = data.snapshot.items
        .filter((item: Item) => item.isChecked)
        .map((item: Item) => item.name);
      setSelectedItems(initiallySelected);
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  const sendSnapshot = async (routeId: number, snapshot: Snapshot) => {
    console.log('sendSnapshot');
    try {
      await putSnapshot(routeId, snapshot);
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };

  useEffect(() => {
    if (snapshot) {
      setItems(snapshot.items);
      const initiallySelected = snapshot.items
        .filter((item: Item) => item.isChecked)
        .map((item: Item) => item.name);
      setSelectedItems(initiallySelected);
    } else if (body) {
      console.log('body', body);
      try {
        const parsingBody = JSON.parse(body);
        setItems(parsingBody.snapshot.items);
        const initiallySelected = parsingBody.snapshot.items
          .filter((item: Item) => item.isChecked)
          .map((item: Item) => item.name);
        setSelectedItems(initiallySelected);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        checkErrorAndViewToast('데이터 형식이 올바르지 않습니다.');
      }
    } else if (routeId) fetchItems(routeId);
  }, []);

  const handleCheckItem = (itemName: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  interface RouteProps {
    routeId: number;
    skip: string;
    snapshot: Snapshot;
  }

  const handleComplete = async (route: RouteProps) => {
    console.log('complete');
    setItems((prevItems) =>
      prevItems?.map((item) => ({
        ...item,
        isChecked: selectedItems.includes(item.name) ? true : false,
      })),
    );
    const newItems = items
      ? items.map((item) => ({
          ...item,
          isChecked: selectedItems.includes(item.name) ? true : false,
        }))
      : [];
    await sendSnapshot(route.routeId, {
      bagId: route.snapshot.bagId,
      items: newItems,
    });
    setSelectedItems([]);
    setItems([]);
    onDismiss();
  };

  useEffect(() => {
    if (items) {
      setIsLoading(false);
    }
  }, [items]);

  const Item = ({ name }: { name: string }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row' }}
      disabled={body ? false : true}
      onPress={() => handleCheckItem(name)}>
      <CheckRound isChecked={selectedItems.includes(name)}>
        {selectedItems.includes(name) && <CheckIcon width={20} height={20} />}
      </CheckRound>
      <CustomText style={{ fontSize: 16, color: colors.GRAY_900, margin: 5 }}>
        {name}
      </CustomText>
    </TouchableOpacity>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          width: 240,
          height: 360,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ImageBackground
          resizeMode='contain'
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('@/assets/img/checklist-background.png')}>
          <View style={{ paddingVertical: 25, paddingHorizontal: 10 }}>
            <Header>
              <CustomText style={{ fontSize: 18, color: colors.GRAY_900 }}>
                체크리스트
              </CustomText>
              <TouchableOpacity
                style={{ position: 'absolute', top: 0, right: 5 }}
                onPress={onDismiss}>
                <CrossButton />
              </TouchableOpacity>
            </Header>
            {skip === 'Y' && (
              <CustomText
                style={{
                  fontSize: 10,
                  color: colors.GRAY_700,
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                건너뛴 항목으로, 이전과 동일한 데이터입니다
              </CustomText>
            )}
            {isLoading ? (
              <ActivityIndicator size={30} color='#B22222' />
            ) : items && items.length > 0 ? (
              <FlatList
                data={items}
                renderItem={({ item }) => <Item name={item.name} />}
                keyExtractor={(item) => item.type + item.name}
                style={{ maxHeight: 280 }}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            ) : (
              <CustomText style={{ color: colors.GRAY_600 }}>
                가방이 비어 있습니다. 소지품을 추가해 보세요!
              </CustomText>
            )}
          </View>
          {body && (
            <ButtonContainerPosition>
              <ButtonContainer onPress={() => handleComplete(JSON.parse(body))}>
                <ButtonText>완료</ButtonText>
              </ButtonContainer>
            </ButtonContainerPosition>
          )}
        </ImageBackground>
      </Modal>
    </Portal>
  );
};

export default CheckListModal;

const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
`;

const CheckRound = styled.View<{ isChecked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  margin: 5px;
  background-color: ${({ isChecked }) =>
    isChecked ? colors.PRIMARY : colors.GRAY_500};
`;

const ButtonContainerPosition = styled.View`
  position: absolute;
  bottom: ${responsiveVertical(10)}px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.TouchableOpacity`
  width: ${responsive(70)}px;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  border-width: 1px;
  border-color: ${colors.PRIMARY};
`;

const ButtonText = styled(CustomText)`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  color: ${colors.PRIMARY};
`;
