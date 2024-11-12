import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { colors } from '@/constants';
import { getMySOSList } from '@/api/lost';
import { SOSDetailData } from '@/types/lost';
import MySosListItem from '@/components/lost/MySosListItem';

type MySOSScreenNavigationProp = StackNavigationProp<MyStackParamList, 'MySOS'>;

type MySOSScreenProps = {
  navigation: MySOSScreenNavigationProp;
};

const MySosScreen = ({ navigation }: MySOSScreenProps) => {
  const [sosList, setSOSList] = useState<SOSDetailData[]>([]);

  useEffect(() => {
    const fetchMySOSList = async () => {
      const data = await getMySOSList();
      setSOSList(data.items);
      console.log(data.items);
    };

    fetchMySOSList();
  }, []);

  const goToDetail = (id: number) => {
    navigation.navigate('SOSDetail', { id });
  };

  return (
    <Container>
      {sosList.map((item) => (
        <MySosListItem
          key={item.id}
          item={item}
          onPress={() => goToDetail(item.id)}
        />
      ))}
    </Container>
  );
};

export default MySosScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;
