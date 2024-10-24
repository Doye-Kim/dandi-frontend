import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigations/RootNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {colors} from '@/constants';

const App = () => {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
      <Toast />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});

export default App;
