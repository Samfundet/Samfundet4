import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { ClosedPeriodDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { defaultOnError } from '../utils';
import { deleteClosedPeriod, postClosedPeriod, putClosedPeriod } from './api';
import { closedPeriodKeys } from './queryKeys';

export function useUpdateClosedPeriod() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClosedPeriodDto> }) => putClosedPeriod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_update_successful));
    },
    onError: defaultOnError,
  });
}

export function useCreateClosedPeriod() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: Partial<ClosedPeriodDto>) => postClosedPeriod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_creation_successful));
    },
    onError: defaultOnError,
  });
}

export function useDeleteClosedPeriod() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => deleteClosedPeriod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    onError: defaultOnError,
  });
}
