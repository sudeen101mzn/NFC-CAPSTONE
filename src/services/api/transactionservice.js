import apiClient from './apiClient';

export const getTransactionHistory = async (filters = {}) => {
  const response = await apiClient.get('/transactions', { params: filters });
  return response.data;
};

export const getRecentTransactions = async (limit = 10) => {
  const response = await apiClient.get('/transactions/recent', {
    params: { limit },
  });
  return response.data;
};

export const getTransactionDetails = async (transactionId) => {
  const response = await apiClient.get(`/transactions/${transactionId}`);
  return response.data;
};

export const getMonthlyTransactionSummary = async (month, year) => {
  const response = await apiClient.get('/transactions/summary', {
    params: { month, year },
  });
  return response.data;
};

const transactionService = {
  getTransactionHistory,
  getRecentTransactions,
  getTransactionDetails,
  getMonthlyTransactionSummary,
};

export default transactionService;
