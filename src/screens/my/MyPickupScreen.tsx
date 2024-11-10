import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { getMyPickupList } from '@/api/lost';
import { colors } from '@/constants';
import { PickupDetailData } from '@/types/lost';
import MyPickupListItem from '@/components/lost/MyPickupListItem';

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
      {pickupList.map((item) => (
        <MyPickupListItem
          key={item.id}
          item={item}
          onPress={() => goToDetail(item.id)}
        />
      ))}
    </Container>
  );
};

export default MyPickupScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;
