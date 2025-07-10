import axiosInstance from '../api/axiosInstance';

export const loginUser = async (email, password) => {
    return axiosInstance.post('/login', { email, password });
};

export const registerUser = (data) => {
    return axiosInstance.post('/register', data);
}