import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigations/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet, Alert } from 'react-native';
import { colors } from '@/constants';
import { useCallback, useEffect } from 'react';

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
