import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const resetPassword = async ({ email, otp, password }) => {
  const { data } = await apiClient.post('/auth/password/reset', { email, otp, password });
  return data;
};

const useResetPasswordWithOtp = (options = {}) =>
  useMutation({
    mutationFn: resetPassword,
    ...options,
  });

export default useResetPasswordWithOtp;
