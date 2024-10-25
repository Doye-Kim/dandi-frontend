import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { authNavigations, colors } from '@/constants';
import AuthHomeScreen from '@/screens/auth/AuthHomeScreen';
import AuthEmailScreen from '@/screens/auth/AuthEmailScreen';
import AuthPasswordScreen from '@/screens/auth/AuthPasswordScreen';
import AuthPhoneScreen from '@/screens/auth/AuthPhoneScreen';
import AuthNameScreen from '@/screens/auth/AuthNameScreen';
import EmailCheckScreen from '@/screens/auth/EmailCheckScreen';
import LoginScreen from '@/screens/auth/LoginScreen';

export type AuthStackParamList = {
  [authNavigations.AUTH_HOME]: undefined;
  [authNavigations.AUTH_EMAIL]: undefined;
  [authNavigations.AUTH_PHONE]: undefined;
  [authNavigations.AUTH_PASSWORD]: undefined;
  [authNavigations.AUTH_NAME]: undefined;
  [authNavigations.EMAIL_CHECK]: undefined;
  [authNavigations.LOGIN]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.WHITE,
        },
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: colors.WHITE,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'OAGothic-Medium',
          paddingLeft: 0,
          marginLeft: 0,
        },
        headerTintColor: colors.BLACK,
      }}
    >
      <Stack.Screen
        name={authNavigations.AUTH_HOME}
        component={AuthHomeScreen}
        options={{
          headerTitle: ' ',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={authNavigations.AUTH_EMAIL}
        component={AuthEmailScreen}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={authNavigations.AUTH_PASSWORD}
        component={AuthPasswordScreen}
        options={{
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={authNavigations.AUTH_PHONE}
        component={AuthPhoneScreen}
        options={{
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={authNavigations.AUTH_NAME}
        component={AuthNameScreen}
        options={{
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={authNavigations.EMAIL_CHECK}
        component={EmailCheckScreen}
        options={{
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={authNavigations.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: ' ',
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
