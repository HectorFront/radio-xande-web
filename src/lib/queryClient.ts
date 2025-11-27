import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const localStoragePersister  = createSyncStoragePersister({
  storage: window.localStorage,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});