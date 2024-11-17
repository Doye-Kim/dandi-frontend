import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { notiNavigations, lostNavigations } from '@/constants/navigations';
import { colors } from '@/constants/colors';
import NotiMainScreen from '@/screens/noti/NotiMainScreen';
import PickupDetailScreen from '@/screens/lost/PickupDetailScreen';
import SOSDetailScreen from '@/screens/lost/SOSDetailScreen';

export type NotiStackParamList = {
  [notiNavigations.NOTI_MAIN]: undefined;
  [lostNavigations.PICKUP_DETAIL]: { id: number };
  [lostNavigations.SOS_DETAIL]: { id: number };
};

const Stack = createStackNavigator<NotiStackParamList>();

function NotiStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: colors.WHITE,
          height: 70,
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
        name={notiNavigations.NOTI_MAIN}
        component={NotiMainScreen}
        options={{
          headerTitle: '알림',
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
      <Stack.Screen
        name={lostNavigations.SOS_DETAIL}
        component={SOSDetailScreen}
        options={{
          headerTitle: 'SOS',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export default NotiStackNavigator;
