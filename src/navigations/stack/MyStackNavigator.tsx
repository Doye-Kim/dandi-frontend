import { createStackNavigator } from '@react-navigation/stack';
import { colors, myNavigations } from '@/constants';
import MyMainScreen from '@/screens/my/MyMainScreen';
import PasswordUpdateScreen from '@/screens/my/PasswordUpdateScreen';
import MyNotiScreen from '@/screens/my/MyNotiScreen';

export type MyStackParamList = {
  [myNavigations.MY_MAIN]: undefined;
  [myNavigations.PASSWORD_UPDATE]: undefined;
  [myNavigations.MY_NOTI]: undefined;
};

const Stack = createStackNavigator<MyStackParamList>();
function MyStackNavigator() {
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
      }}>
      <Stack.Screen
        name={myNavigations.MY_MAIN}
        component={MyMainScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={myNavigations.PASSWORD_UPDATE}
        component={PasswordUpdateScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={myNavigations.MY_NOTI}
        component={MyNotiScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default MyStackNavigator;
