import BackgroundTimer from 'react-native-background-timer';
import axiosInstance from './axios';
import { setHeader, removeHeader } from '@/utils/axios';
import { setEncryptStorage } from '@/utils/encryptedStorage';

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

const postPasswordUpdateVerify = async (email: string) => {
  const { data } = await axiosInstance.post('/auth/password', { email });
  return data;
};

const postPasswordUpdateVerification = async (
  passwordData: UpdatePasswordVerifyProps,
) => {
  const { data } = await axiosInstance.post('/auth/verification', passwordData);
  return data;
};

const patchPasswordUpdate = async (passwordData: UpdatePasswordProps) => {
  const { data } = await axiosInstance.patch('/auth/password', passwordData);
  return data;
};

const login = async (userData: LoginProps, fcmCode: string) => {
  removeHeader('Authorization');
  const { data, headers } = await axiosInstance.post('/auth/login', userData);
  const accessToken = headers.authorization;

  if (accessToken) {
    await setAccessToken(accessToken);
    await putFCM(fcmCode);
  }
  return data;
};

const managerLogin = async (fcmCode: string) => {
  removeHeader('Authorization');
  const { data } = await axiosInstance.post('/auth/manager/jaedoo2');

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

export interface PostPasswordVeriProps {
  verificationNumber: string;
  email: string;
  newPassword: string;
}

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
  const { data } = await axiosInstance.put('/auth/refresh');
  return data;
};

const logout = async () => {
  const { data } = await axiosInstance.put('/auth/logout');
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

export interface PasswordUpdateProps {
  newPassword: string;
  pastPassword: string;
}
const putUpdatePassword = async (password: PasswordUpdateProps) => {
  const { data } = await axiosInstance.put('/member/password', password);
  return data;
};

export {
  join,
  postJoinLink,
  postJoinVerify,
  postPasswordUpdateVerify,
  postPasswordUpdateVerification,
  patchPasswordUpdate,
  login,
  managerLogin,
  refreshAuth,
  logout,
  putFCM,
  getUserInfo,
  putPasswordVerifyNum,
  postPasswordWithVerification,
  putUpdatePassword,
};
