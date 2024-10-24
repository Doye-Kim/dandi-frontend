import React from 'react';
import CustomText from '@/components/CustomText';
import Navbar from './tab/Navbar';

function RootNavigator() {
  const isLogin = true;

  return (
    <>
      {isLogin ? (
        <Navbar />
      ) : (
        <CustomText style={{color: '#424242'}}>로그인 X</CustomText>
      )}
    </>
  );
}

export default RootNavigator;
