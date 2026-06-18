// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
};

// For development on physical devices, use your machine's IP
// export const API_CONFIG = {
//   baseURL: 'http://YOUR_MACHINE_IP:3000/api',
//   timeout: 30000,
// };
