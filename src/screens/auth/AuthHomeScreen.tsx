import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogoIcon } from '@/assets/icons';
import { authNavigations, colors } from '@/constants';
import { AuthStackParamList } from '@/navigations/stack/AuthStackNavigator';
import { responsive } from '@/utils';
import AuthButton from '@/components/auth/AuthButton';

export type AuthHomeScreenProps = {
  navigation: StackNavigationProp<
    AuthStackParamList,
    typeof authNavigations.AUTH_HOME
  >;
};

const AuthHomeScreen = ({ navigation }: AuthHomeScreenProps) => {
  const onPressJoin = () => {
    navigation.navigate(authNavigations.AUTH_EMAIL);
  };
  const onPressLogin = () => {
    navigation.navigate(authNavigations.LOGIN);
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
      <AuthButton title="로그인" onPress={onPressLogin} style="gray" />
      <AuthButton title="회원가입" onPress={onPressJoin} style="enable" />
    </StyledSafeAreaView>
  );
};

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default AuthHomeScreen;
