import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    return { success: true };
  },

  forgotPassword: async (mobileNumber) => {
    const response = await apiClient.post('/auth/forgot-password', { mobileNumber });
    return response.data;
  },

  resetPassword: async (otp, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { otp, newPassword });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  verifyToken: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return null;
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      return null;
    }
  },
};

export default authService;
