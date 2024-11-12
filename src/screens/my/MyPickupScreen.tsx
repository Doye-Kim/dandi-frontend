import React from 'react';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { getMyPickupList } from '@/api/lost';
import { colors } from '@/constants';
import { PickupDetailData } from '@/types/lost';
import MyHeader from '@/components/my/MyHeader';
import MyPickupListItem from '@/components/my/MyPickupListItem';
import CustomText from '@/components/common/CustomText';

type MyPickupScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'MyPickup'
>;

type MyPickupScreenProps = {
  navigation: MyPickupScreenNavigationProp;
};

const MyPickupScreen = ({ navigation }: MyPickupScreenProps) => {
  const [pickupList, setPickupList] = useState<PickupDetailData[]>([]);

  useEffect(() => {
    const fetchMyPickupList = async () => {
      const data = await getMyPickupList();
      setPickupList(data.items);
      console.log(data.items);
    };

    fetchMyPickupList();
  }, []);

  const goToDetail = (id: number) => {
    navigation.navigate('PickupDetail', { id });
  };

  return (
    <Container>
      <MyHeader title={'내가 신고한 분실물'} />
      {pickupList.length > 0 ? (
        <FlatList
          data={pickupList}
          renderItem={({ item }) => (
            <MyPickupListItem item={item} onPress={() => goToDetail(item.id)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyText>내가 신고한 분실물이 없어요.</EmptyText>
      )}
    </Container>
  );
};

export default MyPickupScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const EmptyText = styled(CustomText)`
  text-align: center;
  margin-top: 20px;
`;
