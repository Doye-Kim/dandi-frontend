import BackgroundTimer from 'react-native-background-timer';
import axiosInstance from './axios';
import { setHeader, removeHeader } from '@/utils/axios';
import { getEncryptStorage, setEncryptStorage } from '@/utils/encryptedStorage';

const JWT_EXPIRRY_TIME = 24 * 60 * 60 * 1000; //accessToken 만료시간-> 밀리초

export interface LoginProps {
  email: string;
  password: string;
}

export interface JoinProps extends LoginProps {
  nickname: string;
}

export interface UpdatePasswordVerifyProps {
  verificationNumber: string;
  email: string;
}

export interface UpdatePasswordProps extends UpdatePasswordVerifyProps {
  newPassword: string;
}

export interface PasswordUpdateProps {
  newPassword: string;
  pastPassword: string;
}

export interface PostPasswordVeriProps {
  verificationNumber: string;
  email: string;
  newPassword: string;
}

const join = async (userData: JoinProps) => {
  const { data } = await axiosInstance.post('/auth', userData);
  return data;
};

const postJoinLink = async (email: string) => {
  const { data } = await axiosInstance.post('/auth/email', { email });
  return data;
};

const postJoinVerify = async (email: string) => {
  const { data } = await axiosInstance.post('/auth/verify', { email });
  return data;
};

const login = async (userData: LoginProps, fcmCode: string) => {
  removeHeader('Authorization');
  const { data, headers } = await axiosInstance.post('/auth/login', userData);
  const accessToken = headers.authorization;
  const refreshToken = headers.refreshtoken;

  if (accessToken && refreshToken) {
    await setAccessToken(accessToken);
    await setEncryptStorage('refreshToken', refreshToken);
    await putFCM(fcmCode);
  }
  return data;
};

const managerLogin = async (fcmCode: string, nickname: string) => {
  removeHeader('Authorization');
  const { data } = await axiosInstance.post(`/manager/login/${nickname}`);

  console.log('accessTOkeneeeneene', data);
  if (data) {
    await setAccessToken(data);
    await putFCM(fcmCode);
  }
  return data;
};

const getUserInfo = async () => {
  const { data } = await axiosInstance.get('/member');
  return data;
};

const putPasswordVerifyNum = async (email: string) => {
  const { data } = await axiosInstance.put('/auth/password', { email });
  return data;
};

const postPasswordWithVerification = async (
  postInfo: PostPasswordVeriProps,
) => {
  const { data } = await axiosInstance.post('/auth/password', postInfo);
  return data;
};

const putFCM = async (fcmCode: string) => {
  const { data } = await axiosInstance.put('/member/fcm', { fcmCode });
  return data;
};

const refreshAuth = async () => {
  const pastRefreshToken = await getEncryptStorage('refreshToken');
  const { data, headers } = await axiosInstance.put(
    '/auth/refresh',
    {},
    {
      headers: {
        RefreshToken: pastRefreshToken,
      },
    },
  );
  const accessToken = headers.authorization;
  const refreshToken = headers.refreshtoken;

  if (accessToken && refreshToken) {
    await setAccessToken(accessToken);
    await setEncryptStorage('refreshToken', refreshToken);
  }
  return data;
};

const setAccessToken = async (accessToken: string) => {
  try {
    await setEncryptStorage('accessToken', accessToken);
    setHeader('Authorization', accessToken);
  } catch (err) {
    console.log(err);
  }
  BackgroundTimer.setTimeout(() => {
    refreshAuth();
  }, JWT_EXPIRRY_TIME - 60000);
};

const putUpdatePassword = async (password: PasswordUpdateProps) => {
  const { data } = await axiosInstance.put('/member/password', password);
  return data;
};

const putUpdateNickname = async (nickname: string) => {
  const { data } = await axiosInstance.put('/member/nickname', { nickname });
  return data;
};

export type TargetOption = 'COMMENT' | 'ALL' | 'LOST_ITEM' | 'FOUND_ITEM';

const putUpdateNoti = async ({
  enabled,
  target,
}: {
  enabled: boolean;
  target: TargetOption;
}) => {
  const { data } = await axiosInstance.put('/member/alarm-settings', {
    enabled,
    target,
  });
  return data;
};

const getNotiSetting = async () => {
  const { data } = await axiosInstance.get('/member/alarm-settings');
  return data;
};

const logout = async () => {
  const refreshToken = await getEncryptStorage('refreshToken');
  const { data } = await axiosInstance.delete('/auth/logout', {
    headers: { RefreshToken: refreshToken },
  });
  return data;
};

const deleteUser = async () => {
  const { data } = await axiosInstance.delete('/member');
  return data;
};

export {
  join,
  postJoinLink,
  postJoinVerify,
  login,
  putFCM,
  getUserInfo,
  managerLogin,
  refreshAuth,
  putUpdateNickname,
  putPasswordVerifyNum,
  postPasswordWithVerification,
  putUpdatePassword,
  getNotiSetting,
  putUpdateNoti,
  logout,
  deleteUser,
};
