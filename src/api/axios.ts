import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://k11e205.p.ssafy.io/api',
  withCredentials: true,
});

export default axiosInstance;
