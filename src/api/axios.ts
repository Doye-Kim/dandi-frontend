import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://k11e205.p.ssafy.io/app',
  withCredentials: true,
});

export default axiosInstance;
