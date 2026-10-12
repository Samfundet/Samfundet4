import { QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Ignore HTTP 404 responses
      if (error instanceof AxiosError && error.response?.status === 404) {
        return;
      }

      console.error(error);
      toast.error((query.meta?.errorMsg as string) ?? t(KEY.common_something_went_wrong));
    },
  }),
  defaultOptions: {
    mutations: {
      onError: (error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      },
    },
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on HTTP 404 responses
        if (error instanceof AxiosError && error.response?.status === 404) {
          return false;
        }
        // max 2 retries
        return failureCount < 2;
      },
    },
  },
});
