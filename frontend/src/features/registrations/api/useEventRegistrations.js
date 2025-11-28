import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const fetchEventRegistrations = async ({ queryKey }) => {
  const [, , eventId] = queryKey;
  if (!eventId) return [];
  const { data } = await apiClient.get(`/registrations/event/${eventId}`);
  return data.registrations;
};

const useEventRegistrations = (eventId, options = {}) =>
  useQuery({
    queryKey: ['registrations', 'event', eventId],
    queryFn: fetchEventRegistrations,
    enabled: Boolean(eventId),
    staleTime: 30 * 1000,
    ...options,
  });

export default useEventRegistrations;
