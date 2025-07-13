// src/api/authHooks.js
import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axios';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => {
      return axiosInstance.post('/Login', credentials);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => {
      return axiosInstance.post('/Register', userData);
    },
  });
};