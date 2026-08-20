import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { apiDeleteClosedPeriod, postClosedPeriod, putClosedPeriod } from '~/api';
import type { ClosedPeriodDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { closedPeriodKeys } from './queryKeys';

export function useClosedPeriodMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const updateClosedPeriod = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClosedPeriodDto> }) => putClosedPeriod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_update_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const createClosedPeriod = useMutation({
    mutationFn: postClosedPeriod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_creation_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const deleteClosedPeriod = useMutation({
    mutationFn: (id: number) => apiDeleteClosedPeriod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  return { createClosedPeriod, updateClosedPeriod, deleteClosedPeriod };
}
