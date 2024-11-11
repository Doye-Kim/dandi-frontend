// LostStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { lostNavigations, colors } from '@/constants';
import PickupListScreen from '@/screens/lost/PickupListScreen';
import PickupRegisterScreen from '@/screens/lost/PickupRegisterScreen';
import PickupDetailScreen from '@/screens/lost/PickupDetailScreen';
import SOSListScreen from '@/screens/lost/SOSListScreen';
import SOSRegisterScreen from '@/screens/lost/SOSRegisterScreen';
import RouteSelectionScreen from '@/screens/lost/RouteSelectionScreen';
import SOSDetailScreen from '@/screens/lost/SOSDetailScreen';

export type LostStackParamList = {
  PickupList: undefined;
  PickupRegister: undefined;
  PickupDetail: { id: number };
  SOSList: undefined;
  SOSRegister: undefined;
  RouteSelection: {
    photoUrl: string;
    explain: string;
    location: string;
    datetime: string;
  };
  SOSDetail: { id: number };
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
      {/* 습득물 목록 화면 */}
      <Stack.Screen
        name={lostNavigations.PICKUP_LIST}
        component={PickupListScreen}
        options={{
          headerTitle: '습득물 목록',
          headerTitleAlign: 'center',
        }}
      />
      {/* 습득물 등록 화면 */}
      <Stack.Screen
        name={lostNavigations.PICKUP_REGISTER}
        component={PickupRegisterScreen}
        options={{
          headerTitle: '습득물 등록',
          headerTitleAlign: 'center',
        }}
      />
      {/* 습득물 상세 화면 */}
      <Stack.Screen
        name={lostNavigations.PICKUP_DETAIL}
        component={PickupDetailScreen}
        options={{
          headerTitle: '습득물',
          headerTitleAlign: 'center',
        }}
      />
      {/* SOS 목록 화면 */}
      <Stack.Screen
        name={lostNavigations.SOS_LIST}
        component={SOSListScreen}
        options={{
          headerTitle: 'SOS 목록',
          headerTitleAlign: 'center',
        }}
      />
      {/* SOS 등록 화면 */}
      <Stack.Screen
        name={lostNavigations.SOS_REGISTER}
        component={SOSRegisterScreen}
        options={{
          headerTitle: 'SOS 등록',
          headerTitleAlign: 'center',
        }}
      />
      {/* 경로 선택 화면 */}
      <Stack.Screen
        name={lostNavigations.ROUTE_SELECTION}
        component={RouteSelectionScreen}
        options={{
          headerTitle: '경로 선택',
          headerTitleAlign: 'center',
        }}
      />

      {/* SOS 상세 화면 */}
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

export default LostStackNavigator;
