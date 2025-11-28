import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const cancelRegistrationRequest = async (eventId) => {
  const { data } = await apiClient.delete(`/registrations/${eventId}`);
  return data.registration;
};

const useCancelRegistration = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options;

  return useMutation({
    mutationFn: cancelRegistrationRequest,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'me'] });
      if (typeof variables === 'string') {
        queryClient.invalidateQueries({ queryKey: ['events', 'detail', variables] });
        queryClient.invalidateQueries({ queryKey: ['registrations', 'event', variables] });
      }
      onSuccess?.(data, variables, context);
    },
    ...rest,
  });
};

export default useCancelRegistration;
