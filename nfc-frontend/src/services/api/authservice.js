import apiClient from './apiClient';

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (!response.data.token) {
      throw new Error('No token received from server');
    }

    return response.data;
  } catch (error) {
    console.error('[AuthService] Login Error:', error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    if (!userData || !userData.email || !userData.password || !userData.mobileNumber) {
      throw new Error('Missing required registration fields');
    }

    const response = await apiClient.post('/auth/register', {
      name: userData.fullName || userData.name,
      mobileNumber: userData.mobileNumber,
      email: userData.email,
      password: userData.password,
    });

    if (!response.data.token) {
      throw new Error('No token received from server');
    }

    return response.data;
  } catch (error) {
    console.error('[AuthService] Register Error:', error.message);
    throw error;
  }
};