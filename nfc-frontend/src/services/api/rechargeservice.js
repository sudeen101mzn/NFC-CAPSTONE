import apiClient from './apiClient';

export const processRecharge = async (rechargeData) => {
  try {
    if (!rechargeData) {
      throw new Error('Recharge data is required');
    }
    const response = await apiClient.post('/recharge', rechargeData);
    return response.data;
  } catch (error) {
    console.error('[RechargeService] Process Recharge Error:', error.message);
    throw error;
  }
};

export const getRechargeHistory = async () => {
  try {
    const response = await apiClient.get('/recharge/history');
    return response.data || [];
  } catch (error) {
    console.error('[RechargeService] Get Recharge History Error:', error.message);
    throw error;
  }
};

export const initiateKhaltiPayment = async (amount) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error('Valid amount is required');
    }
    const response = await apiClient.post('/payment/khalti/initiate', { amount });
    return response.data;
  } catch (error) {
    console.error('[RechargeService] Initiate Khalti Payment Error:', error.message);
    throw error;
  }
};

export const verifyKhaltiPayment = async (paymentData) => {
  try {
    if (!paymentData) {
      throw new Error('Payment data is required');
    }
    const response = await apiClient.post('/payment/khalti/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('[RechargeService] Verify Khalti Payment Error:', error.message);
    throw error;
  }
};

export const initiateEsewaPayment = async (amount) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error('Valid amount is required');
    }
    const response = await apiClient.post('/payment/esewa/initiate', { amount });
    return response.data;
  } catch (error) {
    console.error('[RechargeService] Initiate Esewa Payment Error:', error.message);
    throw error;
  }
};

export const verifyEsewaPayment = async (paymentData) => {
  try {
    if (!paymentData) {
      throw new Error('Payment data is required');
    }
    const response = await apiClient.post('/payment/esewa/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('[RechargeService] Verify Esewa Payment Error:', error.message);
    throw error;
  }
};