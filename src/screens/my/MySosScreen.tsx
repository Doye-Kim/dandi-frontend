import React from 'react';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { colors } from '@/constants';
import { getMySOSList } from '@/api/lost';
import { SOSDetailData } from '@/types/lost';
import MyHeader from '@/components/my/MyHeader';
import MySosListItem from '@/components/my/MySosListItem';
import CustomText from '@/components/common/CustomText';

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
      <MyHeader title={'내가 등록한 SOS'} />
      {sosList.length > 0 ? (
        <FlatList
          data={sosList}
          renderItem={({ item }) => (
            <MySosListItem item={item} onPress={() => goToDetail(item.id)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyText>내가 등록한 SOS가 없어요.</EmptyText>
      )}
    </Container>
  );
};

export default MySosScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const EmptyText = styled(CustomText)`
  text-align: center;
  margin-top: 20px;
`;
