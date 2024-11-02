import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { lostNavigations, colors } from '@/constants';
import LostHomeScreen from '@/screens/lost/LostHomeScreen';
import PickupListScreen from '@/screens/lost/PickupListScreen';
import PickupDetailScreen from '@/screens/lost/PickupDetailScreen';

export type LostStackParamList = {
  PickupList: undefined;
  PickupDetail: { id: number };
};

const Stack = createStackNavigator<LostStackParamList>();

function LostStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: colors.WHITE,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'OAGothic-Medium',
          paddingLeft: 0,
          marginLeft: 0,
        },
        headerTintColor: colors.BLACK,
      }}>
      <Stack.Screen
        name={lostNavigations.PICKUP_LIST}
        component={PickupListScreen}
        options={{
          headerTitle: '습득물 목록',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name={lostNavigations.PICKUP_DETAIL}
        component={PickupDetailScreen}
        options={{
          headerTitle: '습득물',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export default LostStackNavigator;
