import apiClient from './apiClient';

const notificationService = {
  getNotifications: async (filters = {}) => {
    const response = await apiClient.get('/notifications', { params: filters });
    return response.data;
  },

  getUnreadNotifications: async () => {
    const response = await apiClient.get('/notifications/unread');
    return response.data;
  },

  getNotificationById: async (notificationId) => {
    const response = await apiClient.get(`/notifications/${notificationId}`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  deleteAllNotifications: async () => {
    const response = await apiClient.delete('/notifications/delete-all');
    return response.data;
  },
};

export default notificationService;
