import React from 'react';
import Navbar from './tab/Navbar';
import AuthStackNavigator from './stack/AuthStackNavigator';
import useUserStore from '@/store/useUserStore';

function RootNavigator() {
  const isLogin = useUserStore((state) => state.isLogin);

  return <>{isLogin ? <Navbar /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
