import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../utils/apiClient.js';

const createEventRequest = async (payload) => {
  const { data } = await apiClient.post('/events', payload);
  return data.event;
};

const useCreateEvent = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options;

  return useMutation({
    mutationFn: createEventRequest,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      onSuccess?.(data, variables, context);
    },
    ...rest,
  });
};

export default useCreateEvent;
