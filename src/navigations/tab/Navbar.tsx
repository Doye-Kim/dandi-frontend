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
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  colors,
  lostNavigations,
  mainNavigations,
  notiNavigations,
} from '@/constants';
import MapMainScreen from '@/screens/map/MapMainScreen';
import LostStackNavigator from '@/navigations/stack/LostStackNavigator';
import BagStackNavigator from '../stack/BagStackNavigator';
import MyStackNavigator from '../stack/MyStackNavigator';
import NotiStackNavigator from '../stack/NotiStackNavigator';

const Tab = createBottomTabNavigator();
const NeedTabBarScreens = [
  lostNavigations.PICKUP_LIST,
  lostNavigations.SOS_LIST,
  'BagMain',
  'MyMain',
  mainNavigations.MAP,
  notiNavigations.NOTI_MAIN,
];

const Navbar = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={mainNavigations.BAG}
        screenOptions={({ route }) => {
          // 현재 화면 이름 가져오기
          const routeName = getFocusedRouteNameFromRoute(route);

          return {
            tabBarIcon: ({ focused }) => {
              let Icon;
              switch (route.name) {
                case mainNavigations.LOST:
                  Icon = focused ? TabLostFocusedIcon : TabLostIcon;
                  break;
                case mainNavigations.MAP:
                  Icon = focused ? TabMapFocusedIcon : TabMapIcon;
                  break;
                case mainNavigations.BAG:
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
            tabBarStyle:
              routeName && !NeedTabBarScreens.includes(routeName)
                ? { display: 'none' }
                : styles.tabBarStyle,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            keyboardHidesTabBar: true,
            headerShown: false,
          };
        }}>
        <Tab.Screen
          name={mainNavigations.LOST}
          component={LostStackNavigator}
        />
        <Tab.Screen name={mainNavigations.MAP} component={MapMainScreen} />
        <Tab.Screen name={mainNavigations.BAG} component={BagStackNavigator} />
        <Tab.Screen
          name={mainNavigations.NOTI}
          component={NotiStackNavigator}
        />
        <Tab.Screen name={mainNavigations.MY} component={MyStackNavigator} />
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
    alignItems: 'center',
    display: 'flex',
  },
});

export default Navbar;
