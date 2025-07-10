// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default axiosInstance;


import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
