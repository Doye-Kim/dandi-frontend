import Toast from 'react-native-toast-message';
import { getErrorMessage } from './errorMessage';
import axios from 'axios';

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
export const showCustomErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
  });
};

export const checkErrorAndViewToast = (error: any) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const { code } = error.response.data as { code: string };
    showErrorToast(code);
  } else
    showCustomErrorToast('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요');
};
