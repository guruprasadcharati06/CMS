import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const fetchEvent = async ({ queryKey }) => {
  const [, , eventId] = queryKey;
  const { data } = await apiClient.get(`/events/${eventId}`);
  return data;
};

const useEvent = (eventId, options = {}) =>
  useQuery({
    queryKey: ['events', 'detail', eventId],
    queryFn: fetchEvent,
    enabled: Boolean(eventId),
    ...options,
  });

export default useEvent;
