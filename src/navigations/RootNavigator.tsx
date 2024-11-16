import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './tab/Navbar';

import {
  getEncryptStorage,
  removeEncryptStorage,
} from '@/utils/encryptedStorage';
import { getUserInfo, refreshAuth } from '@/api/auth';
import { navigationRef } from '../../App';
import AuthStackNavigator from './stack/AuthStackNavigator';
import LostStackNavigator from './stack/LostStackNavigator';
import useUserStore from '@/store/useUserStore';
import useBagStore from '@/store/useBagStore';
import { LostStackParamList } from '@/navigations/stack/LostStackNavigator';

export type RootStackParamList = {
  Main: undefined;
  AuthStackNavigator: undefined;
  LostStackNavigator: {
    screen: keyof LostStackParamList;
    params?: LostStackParamList[keyof LostStackParamList];
  };
};

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isLogin, setIsLogin } = useUserStore();
  const { setDefaultBagId } = useBagStore();
  const { setNickname, setEmail } = useUserStore();

  const getUserData = async () => {
    try {
      const data = await getUserInfo();
      setDefaultBagId(data.bagId);
      setNickname(data.nickname);
      setEmail(data.email);
    } catch (err) {
      console.log(err);
    }
  };

  const autoLogin = async () => {
    const refreshToken = await getEncryptStorage('refreshToken');
    if (refreshToken) {
      try {
        await refreshAuth();
        await getUserData();
        setIsLogin(true);
      } catch (err) {
        removeEncryptStorage('accessToken');
        removeEncryptStorage('refreshToken');
        console.log(err);
      }
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  useEffect(() => {
    if (!isLogin && navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'AuthStackNavigator' }],
      });
    }
  }, [isLogin, navigationRef]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogin ? (
        <>
          <Stack.Screen name='Main' component={Navbar} />
          <Stack.Screen
            name='LostStackNavigator'
            component={LostStackNavigator}
          />
        </>
      ) : (
        <Stack.Screen
          name='AuthStackNavigator'
          component={AuthStackNavigator}
        />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
