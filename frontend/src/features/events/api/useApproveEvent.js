import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const approveEventRequest = async (eventId) => {
  const { data } = await apiClient.patch(`/events/${eventId}/approve`);
  return data.event;
};

const useApproveEvent = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options;

  return useMutation({
    mutationFn: approveEventRequest,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onSuccess?.(data, variables, context);
    },
    ...rest,
  });
};

export default useApproveEvent;
