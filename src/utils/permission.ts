// permissions.js
import { Platform, Alert, Linking } from 'react-native';
import {
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  check,
} from 'react-native-permissions';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const locationGranted = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ]);

    if (
      locationGranted[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !==
        RESULTS.GRANTED ||
      locationGranted[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !==
        RESULTS.GRANTED
    ) {
      Alert.alert('위치 권한 필요', '앱을 사용하려면 위치 권한이 필요합니다.', [
        { text: '취소', style: 'cancel' },
        { text: '설정 열기', onPress: () => Linking.openSettings() },
      ]);
      return false;
    }

    if (Platform.Version >= 30) {
      const backgroundLocationGranted = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );

      if (backgroundLocationGranted !== RESULTS.GRANTED) {
        Alert.alert(
          '백그라운드 위치 권한 필요',
          '백그라운드에서 위치 서비스를 사용하려면 "항상 허용" 권한이 필요합니다.',
          [
            { text: '취소', style: 'cancel' },
            { text: '설정 열기', onPress: () => Linking.openSettings() },
          ],
        );
        return false;
      }
    }
    return true;
  } else if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result !== RESULTS.GRANTED) {
      Alert.alert(
        '위치 권한 필요',
        '앱 사용 중 위치 서비스를 사용하려면 권한을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }
    return true;
  }
  return true;
};

export { requestLocationPermission };
