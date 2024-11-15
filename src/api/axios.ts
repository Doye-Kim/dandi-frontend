import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://k11e205.p.ssafy.io/app',
  withCredentials: true,
});

// 이미지 기본 URL 설정
export const BASE_IMAGE_URL = 'http://k11e205.p.ssafy.io:9000/images/';

// 요청 인터셉터 설정: 요청의 헤더를 콘솔에 출력
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    console.log('Request Headers:', config.headers);
    console.log('Request Body:', JSON.stringify(config.data));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log(
        'Error Data:',
        error.response.data.code,
        error.response.data.message,
      );
      console.log('Error URL:', error.config.url);
      console.log('Error Method:', error.config.method);
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
