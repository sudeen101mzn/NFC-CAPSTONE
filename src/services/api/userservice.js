import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/users/profile', profileData);
    if (response.data.data?.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.post('/users/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  updateProfilePicture: async (imageData) => {
    const formData = new FormData();
    formData.append('profilePicture', imageData);
    
    const response = await apiClient.patch('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getWalletBalance: async () => {
    const response = await apiClient.get('/users/wallet');
    return response.data;
  },

  updatePhoneNumber: async (phoneNumber, otp) => {
    const response = await apiClient.post('/users/phone-verification', {
      phoneNumber,
      otp,
    });
    return response.data;
  },

  deleteAccount: async (password) => {
    const response = await apiClient.post('/users/delete-account', { password });
    if (response.data.success) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return response.data;
  },

  getNotificationPreferences: async () => {
    const response = await apiClient.get('/users/notification-preferences');
    return response.data;
  },

  updateNotificationPreferences: async (preferences) => {
    const response = await apiClient.patch('/users/notification-preferences', preferences);
    return response.data;
  },
};

export default userService;
