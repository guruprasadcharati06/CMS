import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const loginRequest = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
};

const useLogin = (options = {}) =>
  useMutation({
    mutationFn: loginRequest,
    ...options,
  });

export default useLogin;
