import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const requestPasswordOtp = async ({ email }) => {
  const { data } = await apiClient.post('/auth/password/otp', { email });
  return data;
};

const useRequestPasswordOtp = (options = {}) =>
  useMutation({
    mutationFn: requestPasswordOtp,
    ...options,
  });

export default useRequestPasswordOtp;
