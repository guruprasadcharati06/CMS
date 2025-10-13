import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const fetchCurrentUser = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};

const useCurrentUser = (options = {}) =>
  useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: fetchCurrentUser,
    ...options,
  });

export default useCurrentUser;
