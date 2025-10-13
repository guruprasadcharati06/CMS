import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const registerRequest = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
};

const useRegister = (options = {}) =>
  useMutation({
    mutationFn: registerRequest,
    ...options,
  });

export default useRegister;
