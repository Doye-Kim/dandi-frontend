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
// 카메라, 갤러리 권한 요청
const requestCameraAndGalleryPermissions = async () => {
  if (Platform.OS === 'android') {
    const permissions = [PERMISSIONS.ANDROID.CAMERA];

    if (Platform.Version >= 34) {
      permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED);
    } else if (Platform.Version >= 33) {
      permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    } else {
      permissions.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }

    const statuses = await requestMultiple(permissions);
    const allGranted = permissions.every(
      (permission) => statuses[permission] === RESULTS.GRANTED,
    );

    if (!allGranted) {
      Alert.alert(
        '권한 필요',
        '앱에서 카메라와 갤러리에 접근하려면 권한이 필요합니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }
  } else if (Platform.OS === 'ios') {
    const statuses = await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    ]);

    if (
      statuses[PERMISSIONS.IOS.CAMERA] !== RESULTS.GRANTED ||
      statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== RESULTS.GRANTED
    ) {
      Alert.alert(
        '권한 필요',
        '앱에서 카메라와 갤러리에 접근하려면 권한이 필요합니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }
  }
  return true;
};

export { requestLocationPermission, requestCameraAndGalleryPermissions };
