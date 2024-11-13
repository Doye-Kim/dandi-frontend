import React, { useEffect, useState } from 'react';
import Navbar from './tab/Navbar';

import {
  getEncryptStorage,
  removeEncryptStorage,
} from '@/utils/encryptedStorage';
import { getUserInfo, refreshAuth } from '@/api/auth';
import AuthStackNavigator from './stack/AuthStackNavigator';
import useUserStore from '@/store/useUserStore';
import useBagStore from '@/store/useBagStore';

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

  return <>{isLogin ? <Navbar /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
