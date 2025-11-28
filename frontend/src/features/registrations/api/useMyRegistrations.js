import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const fetchMyRegistrations = async () => {
  const { data } = await apiClient.get('/registrations/me/list');
  return data.registrations;
};

const useMyRegistrations = (options = {}) =>
  useQuery({
    queryKey: ['registrations', 'me'],
    queryFn: fetchMyRegistrations,
    staleTime: 60 * 1000,
    ...options,
  });

export default useMyRegistrations;
