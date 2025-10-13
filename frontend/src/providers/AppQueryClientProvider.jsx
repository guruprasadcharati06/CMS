import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useState } from 'react';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
      },
      mutations: {
        retry: 1,
      },
    },
  });

const AppQueryClientProvider = ({ children }) => {
  const [queryClient] = useState(() => createQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

AppQueryClientProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppQueryClientProvider;
