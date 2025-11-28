import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const requestOtp = async ({ email }) => {
  const { data } = await apiClient.post('/auth/register/otp', { email });
  return data;
};

const useRequestRegistrationOtp = (options = {}) =>
  useMutation({
    mutationFn: requestOtp,
    ...options,
  });

export default useRequestRegistrationOtp;
