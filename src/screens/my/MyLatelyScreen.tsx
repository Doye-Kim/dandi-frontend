import React from 'react';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { isAxiosError } from 'axios';
import { showCustomErrorToast } from '@/utils';
import { colors } from '@/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyStackParamList } from '@/navigations/stack/MyStackNavigator';
import { PickupDetailData } from '@/types/lost';
import { getMyLatelyList } from '@/api/lost';
import CustomText from '@/components/common/CustomText';
import MyHeader from '@/components/my/MyHeader';
import MyPickupListItem from '@/components/my/MyPickupListItem';

type MyLatelyScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'MyLately'
>;

type MyLatelyScreenProps = {
  navigation: MyLatelyScreenNavigationProp;
};

const MyLatelyScreen = ({ navigation }: MyLatelyScreenProps) => {
  const [latelyList, setLatelyList] = useState<PickupDetailData[]>([]);

  useEffect(() => {
    const fetchMyLatelyList = async () => {
      try {
        const data = await getMyLatelyList();
        setLatelyList(data.items);
      } catch (error) {
        if (isAxiosError(error)) {
          showCustomErrorToast(error.response?.data.message);
        }
      }
    };

    fetchMyLatelyList();
  }, []);

  const goToDetail = (id: number) => {
    navigation.navigate('PickupDetail', { id });
  };

  return (
    <Container>
      <MyHeader title={'최근 조회한 분실물'} />
      {latelyList.length > 0 ? (
        <FlatList
          data={latelyList}
          renderItem={({ item }) => (
            <MyPickupListItem item={item} onPress={() => goToDetail(item.id)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyText>최근 조회한 분실물이 없어요.</EmptyText>
      )}
    </Container>
  );
};

export default MyLatelyScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.WHITE};
`;

const EmptyText = styled(CustomText)`
  text-align: center;
  margin-top: 20px;
`;
