/**
 * @format
 */

import { AppRegistry, Alert } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import { displayNotification } from '@/utils/notification';

// Background message 수신
messaging().setBackgroundMessageHandler(displayNotification);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

// `gestureHandlerRootHOC`로 `HeadlessCheck`를 래핑
AppRegistry.registerComponent(appName, () =>
  gestureHandlerRootHOC(HeadlessCheck),
);
