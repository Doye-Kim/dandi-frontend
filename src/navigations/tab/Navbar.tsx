import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  TabLostIcon,
  TabLostFocusedIcon,
  TabMapIcon,
  TabMapFocusedIcon,
  TabBagIcon,
  TabBagFocusedIcon,
  TabNotiIcon,
  TabNotiFocusedIcon,
  TabMyIcon,
  TabMyFocusedIcon,
} from '@/assets/icons';
import { View, StyleSheet } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type MainNavigationsType =
  (typeof mainNavigations)[keyof typeof mainNavigations];

export type RootParamList = {
  Lost: undefined;
  Map: undefined;
  Things: undefined;
  Notification: undefined;
  My: undefined;
};

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<Record<MainNavigationsType, undefined>>,
  StackNavigationProp<RootParamList>
>;
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import { colors, mainNavigations } from '@/constants';
import MapMainScreen from '@/screens/map/MapMainScreen';
import ThingsMainScreen from '@/screens/things/ThingsMainScreen';
import MyMainScreen from '@/screens/my/MyMainScreen';
import NotiMainScreen from '@/screens/noti/NotiMainScreen';
import LostStackNavigator from '@/navigations/stack/LostStackNavigator';

const Tab = createBottomTabNavigator();
// #todo: 현재 screen을 바로 연결해뒀지만 기능 개발 시 stack navigator 연결 필요
const Navbar = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={mainNavigations.THINGS}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let Icon;
            switch (route.name) {
              case mainNavigations.LOST:
                Icon = focused ? TabLostFocusedIcon : TabLostIcon;
                break;
              case mainNavigations.MAP:
                Icon = focused ? TabMapFocusedIcon : TabMapIcon;
                break;
              case mainNavigations.THINGS:
                Icon = focused ? TabBagFocusedIcon : TabBagIcon;
                break;
              case mainNavigations.NOTI:
                Icon = focused ? TabNotiFocusedIcon : TabNotiIcon;
                break;
              case mainNavigations.MY:
                Icon = focused ? TabMyFocusedIcon : TabMyIcon;
                break;
              default:
                Icon = TabBagIcon;
            }
            return <Icon />;
          },
          tabBarStyle: styles.tabBarStyle,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          keyboardHidesTabBar: true,
          headerShown: false,
        })}>
        <Tab.Screen
          name={mainNavigations.LOST}
          component={LostStackNavigator}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: mainNavigations.LOST }],
              });
            },
          }}
        />
        <Tab.Screen
          name={mainNavigations.MAP}
          component={MapMainScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: mainNavigations.MAP }],
              });
            },
          }}
        />
        <Tab.Screen
          name={mainNavigations.THINGS}
          component={ThingsMainScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: mainNavigations.THINGS }],
              });
            },
          }}
        />
        <Tab.Screen
          name={mainNavigations.NOTI}
          component={NotiMainScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: mainNavigations.NOTI }],
              });
            },
          }}
        />
        <Tab.Screen
          name={mainNavigations.MY}
          component={MyMainScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: mainNavigations.MY }],
              });
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: colors.WHITE,
    height: 70,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    display: 'flex',
  },
});

export default Navbar;
