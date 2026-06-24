import apiClient from './apiClient';

export const getTransactions = async () => {
  try {
    const response = await apiClient.get('/user/transactions');
    return response.data || [];
  } catch (error) {
    console.error('[TransactionService] Get Transactions Error:', error.message);
    throw error;
  }
};