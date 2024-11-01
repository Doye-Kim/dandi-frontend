import { Modal, Portal } from 'react-native-paper';
import styled from 'styled-components/native';
import { Snapshot } from '@/api/map';
import { CheckIcon, CrossButton } from '@/assets/icons';
import { colors } from '@/constants';
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../common/CustomText';
import data from '@/dummy/route.json';

const CheckListModal = ({
  visible,
  onDismiss,
  routeId,
  snapshot,
  skip,
}: {
  visible: boolean;
  onDismiss: () => void;
  routeId: number;
  snapshot?: Snapshot;
  skip?: string;
}) => {
  // #todo: snapshot과 skip 값이 있으면 해당 값을 출력
  //          없으면 routeId를 이용해 조회해 출력
  const Item = ({ name, isChecked }: { name: string; isChecked: boolean }) => (
    <View style={{ flexDirection: 'row' }}>
      <CheckRound isChecked={isChecked}>
        {isChecked && <CheckIcon width={20} height={20} />}
      </CheckRound>
      <CustomText style={{ fontSize: 16, color: colors.GRAY_900, margin: 5 }}>
        {name}
      </CustomText>
    </View>
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
          resizeMode="contain"
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
            <FlatList
              data={data.startSnapshot.items}
              renderItem={({ item }) => (
                <Item name={item.name} isChecked={item.isChecked} />
              )}
              keyExtractor={item => item.type + item.name}
              style={{ maxHeight: 280 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          </View>
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
