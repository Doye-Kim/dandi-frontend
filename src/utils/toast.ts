import Toast from 'react-native-toast-message';
import { getErrorMessage } from './errorMessage';

export const showToast = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
  });
};
export const showErrorToast = (code: string) => {
  Toast.show({
    type: 'error',
    text1: getErrorMessage(code),
  });
};
