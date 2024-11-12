import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import axios from 'axios';
import { LogoIcon } from '@/assets/icons';
import { authNavigations, colors } from '@/constants';
import { AuthStackParamList } from '@/navigations/stack/AuthStackNavigator';
import { responsive, showErrorToast } from '@/utils';
import { getUserInfo, managerLogin } from '@/api/auth';
import { setEncryptStorage } from '@/utils/encryptedStorage';
import AuthButton from '@/components/auth/AuthButton';
import useAuthStore from '@/store/useAuthStore';
import useUserStore from '@/store/useUserStore';
import messaging from '@react-native-firebase/messaging';
import useBagStore from '@/store/useBagStore';

export type AuthHomeScreenProps = {
  navigation: StackNavigationProp<
    AuthStackParamList,
    typeof authNavigations.AUTH_HOME
  >;
};

const AuthHomeScreen = ({ navigation }: AuthHomeScreenProps) => {
  const { resetAuthInfo } = useAuthStore();
  useFocusEffect(
    useCallback(() => {
      resetAuthInfo();
    }, []),
  );
  const { setIsLogin } = useUserStore();
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
      console.log('getUserData', data);
      setDefaultBagId(data.bagId);
      await setEncryptStorage('user', JSON.stringify(data));
      setIsLogin(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getFcmToken = useCallback(async () => {
    const data = await messaging().getToken();
    console.log('fcm', data);
    return data;
  }, []);

  const handleLogin = async () => {
    const fcmCode = await getFcmToken();
    try {
      await managerLogin(fcmCode);
      await getUserData();
      setIsLogin(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code } = error.response.data as { code: string };
        showErrorToast(code);
      }
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
