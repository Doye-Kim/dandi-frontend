import axiosInstance from './axios';
import { setHeader } from '@/utils/axios';
import { setEncryptStorage } from '@/utils/encryptedStorage';

const JWT_EXPIRRY_TIME = 1800 * 1000; //accessToken 만료시간-> 밀리초

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
  const data = await axiosInstance.post('/auth', userData);
  return data;
};

const postJoinLink = async (email: string) => {
  const data = await axiosInstance.post('/auth/email', { email });
  return data;
};

const postJoinVerify = async (email: string) => {
  const data = await axiosInstance.post('/auth/verify', { email });
  return data;
};

const postPasswordUpdateVerify = async (email: string) => {
  const data = await axiosInstance.post('/auth/password', { email });
  return data;
};

const postPasswordUpdateVerification = async (
  passwordData: UpdatePasswordVerifyProps,
) => {
  const data = await axiosInstance.post('/auth/verification', passwordData);
  return data;
};

const patchPasswordUpdate = async (passwordData: UpdatePasswordProps) => {
  const data = await axiosInstance.patch('/auth/password', passwordData);
  return data;
};

const login = async (userData: LoginProps) => {
  const { data, headers } = await axiosInstance.post('/auth/login', userData);
  console.log(headers);
  const accessToken = headers.authorization;
  // console.log(accessToken);
  if (accessToken) {
    setAccessToken(accessToken);
  }

  return data;
};

// 헤더로 보냄
const putFCM = async (fcmToken: string) => {
  setHeader('fcmCode', fcmToken);
  const data = await axiosInstance.post('/member/fcm');
  return data;
};

const refreshAuth = async () => {
  const data = await axiosInstance.put('/auth/refresh');
  return data;
};

const logout = async () => {
  const data = await axiosInstance.put('/auth/logout');
  return data;
};

const setAccessToken = async (accessToken: string) => {
  try {
    await setEncryptStorage('accessToken', accessToken);
    // console.log('token', accessToken);
    setHeader('Authorization', accessToken);
  } catch (err) {
    console.log(err);
  }
  setTimeout(refreshAuth, JWT_EXPIRRY_TIME - 60000);
};

export {
  join,
  postJoinLink,
  postJoinVerify,
  postPasswordUpdateVerify,
  postPasswordUpdateVerification,
  patchPasswordUpdate,
  login,
  refreshAuth,
  logout,
  putFCM,
};
