import apiClient from './apiClient';

export const processRecharge = async (rechargeData) => {
  const response = await apiClient.post('/recharge', rechargeData);
  return response.data;
};

export const getRechargeHistory = async (filters = {}) => {
  const response = await apiClient.get('/recharge/history', { params: filters });
  return response.data;
};

export const getRechargeDetails = async (rechargeId) => {
  const response = await apiClient.get(`/recharge/${rechargeId}`);
  return response.data;
};

// Khalti Payment
export const initiateKhaltiPayment = async (amount) => {
  const response = await apiClient.post('/payment/khalti/initiate', { amount });
  return response.data;
};

export const verifyKhaltiPayment = async (paymentData) => {
  const response = await apiClient.post('/payment/khalti/verify', paymentData);
  return response.data;
};

// Esewa Payment
export const initiateEsewaPayment = async (amount) => {
  const response = await apiClient.post('/payment/esewa/initiate', { amount });
  return response.data;
};

export const verifyEsewaPayment = async (paymentData) => {
  const response = await apiClient.post('/payment/esewa/verify', paymentData);
  return response.data;
};

// Bank/Card Payment
export const initiateBankPayment = async (amount, cardId) => {
  const response = await apiClient.post('/payment/bank/initiate', { amount, cardId });
  return response.data;
};

export const verifyBankPayment = async (paymentData) => {
  const response = await apiClient.post('/payment/bank/verify', paymentData);
  return response.data;
};

const rechargeService = {
  processRecharge,
  getRechargeHistory,
  getRechargeDetails,
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  initiateEsewaPayment,
  verifyEsewaPayment,
  initiateBankPayment,
  verifyBankPayment,
};

export default rechargeService;