import apiClient from './apiClient';

const routeService = {
  getAllRoutes: async (filters = {}) => {
    const response = await apiClient.get('/routes', { params: filters });
    return response.data;
  },

  getRouteDetails: async (routeId) => {
    const response = await apiClient.get(`/routes/${routeId}`);
    return response.data;
  },

  searchRoutes: async (source, destination, date) => {
    const response = await apiClient.get('/routes/search', {
      params: { source, destination, date },
    });
    return response.data;
  },

  getFareInfo: async (routeId) => {
    const response = await apiClient.get(`/routes/${routeId}/fare`);
    return response.data;
  },

  getRouteSchedule: async (routeId) => {
    const response = await apiClient.get(`/routes/${routeId}/schedule`);
    return response.data;
  },

  getAvailableSeats: async (routeId, tripDate) => {
    const response = await apiClient.get(`/routes/${routeId}/seats`, {
      params: { date: tripDate },
    });
    return response.data;
  },
};

export default routeService;
