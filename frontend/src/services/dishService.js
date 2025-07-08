import axiosInstance from '../api/axiosInstance';

// export const getAllDishes = (filters = {}) => {
//   return axiosInstance.get('/dishes', { params: filters });
// };

export const getAllDishes = (filters = {}, page = 1, limit = 10) => {
  const params = new URLSearchParams({ ...filters, page, limit });
  return axiosInstance.get(`/dishes?${params.toString()}`);
};

export const getDishById = (id) => {
  return axiosInstance.get(`/dishes/${id}`);
};

export const suggestDishes = (ingredients) => {
  return axiosInstance.post('/suggest', { ingredients });
};
