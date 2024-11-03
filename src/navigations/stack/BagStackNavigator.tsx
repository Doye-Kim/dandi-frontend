import { bagNavigations, colors } from '@/constants';
import BagMainScreen from '@/screens/bag/BagMainScreen';
import { createStackNavigator } from '@react-navigation/stack';

export type BagStackParamList = {
  [bagNavigations.BAG_MAIN]: undefined;
};

const Stack = createStackNavigator<BagStackParamList>();
function BagStackNavigator() {
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
        name={bagNavigations.BAG_MAIN}
        component={BagMainScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default BagStackNavigator;
