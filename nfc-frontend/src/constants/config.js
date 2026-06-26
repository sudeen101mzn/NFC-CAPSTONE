import { Platform } from 'react-native';

// Android Emulator uses 10.0.2.2 to access host machine
// For physical device on same network, replace the host with your machine IP.
export const API_CONFIG = {
  BASE_URL: Platform.select({
    android: 'http://10.0.2.2:3000/api',
    ios: 'http://localhost:3000/api',
    default: 'http://localhost:3000/api',
  }),
  TIMEOUT: 10000,
};
