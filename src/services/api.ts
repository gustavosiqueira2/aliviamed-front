import axios from 'axios';

import { ROUTE_NAMES } from '@constants/ROUTE_NAMES';
import {
  LOCAL_STORAGE_CLINIC_ID,
  LOCAL_STORAGE_TOKEN_KEY,
} from '@constants/LOCAL_STORAGE_KEYS';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const clinicId = localStorage.getItem(LOCAL_STORAGE_CLINIC_ID);
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  if (clinicId) {
    config.headers['x-clinic-id'] = clinicId;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (location.pathname.includes(ROUTE_NAMES.SIGN_IN)) {
      return Promise.reject(['Login ou Senha não conferem']);
    }

    if (error.response.statusText === 'Unauthorized') {
      window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      window.localStorage.removeItem(LOCAL_STORAGE_CLINIC_ID);

      return (location.href = '/');
    }

    return Promise.reject(error);
  },
);

export default api;
