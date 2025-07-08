import axiosInstance from '../api/axiosInstance';

export const getAllIngredients = () => {
  return axiosInstance.get('/ingredients');
};
