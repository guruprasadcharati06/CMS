import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const fetchEvents = async ({ queryKey }) => {
  const [, params] = queryKey;
  const { data } = await apiClient.get('/events', { params });
  return data.events;
};

const useEvents = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['events', params],
    queryFn: fetchEvents,
    ...options,
  });

export default useEvents;
