import { ErrorMessages, SharedErrorMessages } from '@/constants';

export const getErrorMessage = (errorCode: string): string => {
  const authErrorCodes = [
    'E001',
    'E002',
    'E003',
    'E004',
    'E005',
    'E006',
    'E007',
    'E008',
    'E009',
  ];

  if (authErrorCodes.includes(errorCode)) {
    return SharedErrorMessages.AUTH_ERROR;
  }

  // 개별 에러 코드 메시지 반환
  return ErrorMessages[errorCode] || SharedErrorMessages.AUTH_ERROR;
};
