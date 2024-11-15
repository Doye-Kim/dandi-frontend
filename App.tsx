import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message';
import { Provider as PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import RootNavigator from './src/navigations/RootNavigator';
import { displayNotification } from '@/utils/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckListModal from '@/components/map/ChecklistModal';

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: any) => {
    const text1 = props?.text1 ?? '';
    const isLongText = text1 > 17;
    const shortText1 = isLongText ? text1.slice(0, 17) : text1;
    const text2 = isLongText ? text1.slice(17) : '';

    return (
      <SuccessToast
        {...props}
        text1={shortText1}
        text2={text2}
        text1Style={{
          color: colors.BLACK,
          fontFamily: 'OAGothic-Medium',
          fontSize: 11,
        }}
        text2Style={{
          color: colors.BLACK,
          fontFamily: 'OAGothic-Medium',
          fontSize: 11,
        }}
      />
    );
  },
  error: (props: any) => {
    const text1 = props?.text1 ?? '';
    const isLongText = text1 > 17;
    const shortText1 = isLongText ? text1.slice(0, 17) : text1;
    const text2 = isLongText ? text1.slice(17) : '';

    return (
      <ErrorToast
        {...props}
        text1={shortText1}
        text2={text2}
        text1Style={{
          color: colors.BLACK,
          fontFamily: 'OAGothic-Medium',
          fontSize: 11,
        }}
        text2Style={{
          color: colors.BLACK,
          fontFamily: 'OAGothic-Medium',
          fontSize: 11,
        }}
      />
    );
  },
};

let triggerModal: ((body: string) => void) | null = null;

const App = () => {
  // FCM 포그라운드 메시지 처리
  useEffect(() => {
    const unsubscribe = messaging().onMessage(displayNotification);
    return unsubscribe;
  }, []);

  useEffect(() => {
    triggerModal = (body: string) => {
      setModalVisible(true);
      setStartMovementData(body);
    };

    return () => {
      triggerModal = null;
    };
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);
  const [startMovementData, setStartMovementData] = useState<string>('');

  triggerModal = (body: string) => {
    setModalVisible(true);
    setStartMovementData(body);
    AsyncStorage.setItem('routeId', JSON.stringify(JSON.parse(body).routeId));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <View style={styles.container}>
          <NavigationContainer>
            <RootNavigator />
            {startMovementData && (
              <CheckListModal
                visible={isModalVisible}
                onDismiss={() => setModalVisible(false)}
                body={startMovementData}
              />
            )}
          </NavigationContainer>
        </View>
        <Toast config={toastConfig} />
      </PaperProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});

export default App;
export { triggerModal };
