import axiosInstance from './axios';
import qs from 'qs';
// 습득물 등록 파라미터 타입
interface RegisterPickupParams {
  category: 'OTHER' | 'CARD' | 'ID';
  foundLocation: {
    lat: number;
    lon: number;
  };
  image: string;
  foundAt: string;
  storageDesc: string;
  itemDesc: string;
}
// SOS 등록 파라미터 타입
interface RegisterSOSParams {
  situationDesc: string;
  itemDesc: string;
  lostAt: string;
  startRoute: number;
  finishRoute: number;
  images: string[];
}

// 알람 목록 조회 API
const getAlertList = async (resourceId = 0, types = ['foundItem']) => {
  const { data } = await axiosInstance.get('/noti', {
    params: {
      resourceId,
      types,
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  return data;
};
// 알림 목록 삭제 API
const deleteAlert = async (alertList: number[]) => {
  const { data } = await axiosInstance.delete('/noti', {
    params: { alertList },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  return data;
};
// 습득물, 분실물 사진 등록 API
const uploadImage = async (image: any, itemType: string) => {
  const { data } = await axiosInstance.post(`/images/${itemType}`, image, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
// 습득물 등록 API
const registerPickup = async (pickupParms: RegisterPickupParams) => {
  const { data } = await axiosInstance.post('/founds', pickupParms);
  return data;
};
// 내가 등록한 습득물 목록 조회 API
const getMyPickupList = async () => {
  const { data } = await axiosInstance.get('/member/founds');
  return data;
};
// 습득물 상세정보 조회 API
const getPickupDetail = async (foundId: number) => {
  const { data } = await axiosInstance.get(`/founds/${foundId}`);
  return data;
};
// 습득물 퀴즈 조회 API
const getPickupQuiz = async (foundId: number) => {
  const { data } = await axiosInstance.get(`/founds/${foundId}/quiz`);
  return data;
};
// 습득물 퀴즈 제출 API
const submitPickupQuiz = async (
  foundId: number,
  quizId: number,
  answer: string,
) => {
  const { data } = await axiosInstance.post(`/founds/${foundId}/${quizId}`, {
    answer,
  });
  return data;
};
// 내가 등록한 SOS 목록 조회 API
const getMySOSList = async () => {
  const { data } = await axiosInstance.get('/member/losts');
  return data;
};
// SOS 등록 API
const registerSOS = async (lostParms: RegisterSOSParams) => {
  const { data } = await axiosInstance.post('/losts', lostParms);
  return data;
};

export {
  getAlertList,
  getPickupQuiz,
  submitPickupQuiz,
  uploadImage,
  registerPickup,
  getMyPickupList,
  getPickupDetail,
  getMySOSList,
  registerSOS,
};
