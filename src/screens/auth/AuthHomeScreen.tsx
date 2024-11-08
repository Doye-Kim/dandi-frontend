import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { LogoIcon } from '@/assets/icons';
import { authNavigations, colors } from '@/constants';
import { AuthStackParamList } from '@/navigations/stack/AuthStackNavigator';
import { responsive, setHeader } from '@/utils';
import AuthButton from '@/components/auth/AuthButton';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/axios';
import useUserStore from '@/store/useUserStore';

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

  const onPressJoin = () => {
    navigation.navigate(authNavigations.AUTH_EMAIL);
  };
  const onPressLogin = () => {
    navigation.navigate(authNavigations.LOGIN);
  };

  const onPressManager = async () => {
    try {
      const { data } = await axiosInstance.post('/auth/manager/jaedoo2');
      setHeader('Authorization', data);
      setIsLogin(true);
    } catch (err) {
      console.log(err);
    }
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
