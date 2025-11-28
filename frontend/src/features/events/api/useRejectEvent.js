import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const rejectEventRequest = async (eventId) => {
  const { data } = await apiClient.patch(`/events/${eventId}/reject`);
  return data.event;
};

const useRejectEvent = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options;

  return useMutation({
    mutationFn: rejectEventRequest,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onSuccess?.(data, variables, context);
    },
    ...rest,
  });
};

export default useRejectEvent;
