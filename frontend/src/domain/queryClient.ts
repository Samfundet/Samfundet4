import { QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import { defaultOnError } from './utils';

function is404(error: Error) {
  return error instanceof AxiosError && error.response?.status === 404;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (is404(error)) {
        return;
      }

      console.error(error);
      toast.error((query.meta?.errorMsg as string) ?? t(KEY.common_something_went_wrong));
    },
  }),
  defaultOptions: {
    mutations: {
      onError: defaultOnError,
    },
    queries: {
      retry: (failureCount, error) => {
        if (is404(error)) {
          return false;
        }
        // max 2 retries
        return failureCount < 2;
      },
    },
  },
});
