import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import type { ID } from '../types';
import { deleteClosedPeriod, postClosedPeriod, putClosedPeriod } from './api';
import { closedPeriodKeys } from './queryKeys';
import type { ClosedPeriodDto } from './types';

export function useUpdateClosedPeriod() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: ID; data: Partial<ClosedPeriodDto> }) => putClosedPeriod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_update_successful));
    },
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
  });
}

export function useDeleteClosedPeriod() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: ID) => deleteClosedPeriod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
  });
}
