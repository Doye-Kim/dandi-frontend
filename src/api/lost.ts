import axiosInstance from './axios';

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
// 내가 등록한 SOS 목록 조회 API
const getMySOSList = async () => {
  const { data } = await axiosInstance.get('/member/losts');
  return data;
};
// 습득물 상세정보 조회 API
const getPickupDetail = async (foundId: number) => {
  const { data } = await axiosInstance.get(`/founds/${foundId}`);
  return data;
};

export {
  uploadImage,
  registerPickup,
  getMyPickupList,
  getMySOSList,
  getPickupDetail,
};
