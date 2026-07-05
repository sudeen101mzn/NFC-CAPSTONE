import apiClient from './apiClient';

export const login = async (email, password) => {

  console.log('Calling Backend...');

  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });

  console.log('Backend Response:', response.data);

  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', {
    name: userData.fullName,
    mobileNumber: userData.mobileNumber,
    email: userData.email,
    password: userData.password,
  });

  return response.data;
};