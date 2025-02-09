import axios from 'axios';
// config
// import { BASE_URL } from '../config/site';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ 
//   baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
 });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

// ----------------------------------------------------------------------

// Kubernetes-cheetsheet/contributors

export const endpoints = {
  repos: 'https://api.github.com/users/krishna-commits/repos?sort=created&direction=desc',
  repolanguages: 'https://api.github.com/repos/krishna-commits/',
  repocontributors: 'https://api.github.com/repos/krishna-commits/'
};
