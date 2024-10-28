import React from 'react';
import Navbar from './tab/Navbar';
import AuthStackNavigator from './stack/AuthStackNavigator';
import useUserStore from '@/store/useUserStore';
// #todo : 이후 이메일 인증 여부에 따라 AuthStackNavigator의 초기 화면을 설정해야 함
function RootNavigator() {
  const isLogin = useUserStore(state => state.isLogin);

  return <>{isLogin ? <Navbar /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;
