import React, { useEffect, useState } from 'react';
import Navbar from './tab/Navbar';
import messaging from '@react-native-firebase/messaging';
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
      console.log('getUserData', data);
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
  const [fcmData, setFcmData] = useState<{ title?: string; body?: string }>({});
  // FCM 포그라운드 메시지 처리
  useEffect(() => {
    // removeEncryptStorage('accessToken');
    // removeEncryptStorage('refreshToken');
    if (!isLogin) autoLogin();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        console.log(remoteMessage.notification);
        const { title, body } = remoteMessage.notification;
        setFcmData({ title, body });
        console.log({ title, body });
      }
    });

    return unsubscribe;
  }, []);

  return <>{isLogin ? <Navbar /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
