import axiosInstance from '../api/axiosInstance';

export const searchDishes = (query) => {
  return axiosInstance.get(`/search?q=${query}`);
};
