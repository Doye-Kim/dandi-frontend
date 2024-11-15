import React from 'react';
import { useState, useCallback } from 'react';
import { Text, View, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import axios from 'axios';
import { LogoIcon } from '@/assets/icons';
import { authNavigations, colors } from '@/constants';
import { AuthStackParamList } from '@/navigations/stack/AuthStackNavigator';
import {
  checkErrorAndViewToast,
  responsive,
  responsiveVertical,
  showErrorToast,
} from '@/utils';
import { getUserInfo, managerLogin } from '@/api/auth';
import AuthButton from '@/components/auth/AuthButton';
import useAuthStore from '@/store/useAuthStore';
import useUserStore from '@/store/useUserStore';
import messaging from '@react-native-firebase/messaging';
import useBagStore from '@/store/useBagStore';
import Toast from 'react-native-toast-message';

export type AuthHomeScreenProps = {
  navigation: StackNavigationProp<
    AuthStackParamList,
    typeof authNavigations.AUTH_HOME
  >;
};

const AuthHomeScreen = ({ navigation }: AuthHomeScreenProps) => {
  const { resetAuthInfo } = useAuthStore();
  // todo: 관리자 로그인 및 관련 모두 삭제
  const [managerId, setManagerId] = useState<string>('');
  useFocusEffect(
    useCallback(() => {
      resetAuthInfo();
    }, []),
  );
  const { setIsLogin, setEmail, setNickname, setId } = useUserStore();
  const { setDefaultBagId } = useBagStore();
  const onPressJoin = () => {
    navigation.navigate(authNavigations.AUTH_EMAIL);
  };
  const onPressLogin = () => {
    navigation.navigate(authNavigations.LOGIN);
  };

  const getUserData = async () => {
    try {
      const data = await getUserInfo();
      setDefaultBagId(data.bagId);
      setNickname(data.nickname);
      setEmail(data.email);
      setId(data.id);
    } catch (err) {
      console.log(err);
    }
  };

  const getFcmToken = useCallback(async () => {
    const data = await messaging().getToken();
    return data;
  }, []);

  const handleLogin = async () => {
    const fcmCode = await getFcmToken();
    try {
      await managerLogin(fcmCode, managerId);
      await getUserData();
      setIsLogin(true);
    } catch (error) {
      checkErrorAndViewToast(error);
    }
  };
  const onPressManager = async () => {
    handleLogin();
  };
  return (
    <StyledSafeAreaView>
      <View style={{ marginBottom: 50 }}>
        <LogoIcon width={150} height={150} />
        <Text
          style={{
            fontFamily: 'OAGothic-ExtraBold',
            fontSize: responsive(64),
            color: colors.PRIMARY,
          }}>
          단디
        </Text>
      </View>
      <AuthButton title='로그인' onPress={onPressLogin} style='gray' />
      <AuthButton title='회원가입' onPress={onPressJoin} style='enable' />
      <TextInput
        placeholder='관리자 ID 입력'
        value={managerId}
        onChangeText={setManagerId}
        style={{
          width: responsive(352), // Adjusted to match the default width of buttons
          height: responsiveVertical(60), // Similar height to buttons
          paddingHorizontal: 15, // Horizontal padding for comfortable typing
          marginVertical: responsiveVertical(10), // Vertical margin to separate elements
          borderColor: colors.PRIMARY,
          borderWidth: 1,
          borderRadius: responsive(20), // Consistent rounded corners
          backgroundColor: colors.WHITE, // Background color for a clean look
          fontSize: responsive(16), // Consistent font size
          color: colors.BLACK, // Text color
          fontFamily: 'OAGothic-Regular', // Consistent font style
        }}
      />
      <AuthButton
        title='관리자 로그인'
        onPress={onPressManager}
        style='enable'
      />
    </StyledSafeAreaView>
  );
};

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default AuthHomeScreen;
