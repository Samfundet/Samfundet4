import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { ClosedPeriodDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { deleteClosedPeriod, postClosedPeriod, putClosedPeriod } from './api';
import { closedPeriodKeys } from './queryKeys';

type UpdateParams = { id: number; data: Partial<ClosedPeriodDto> };
export function useUpdateClosedPeriod(
  options?: Omit<UseMutationOptions<ClosedPeriodDto, Error, UpdateParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: UpdateParams) => putClosedPeriod(id, data),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_update_successful));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (err, variables, onMutateResult, context) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
}

type CreateParams = Partial<ClosedPeriodDto>;
export function useCreateClosedPeriod(
  options?: Omit<UseMutationOptions<ClosedPeriodDto, Error, CreateParams>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateParams) => postClosedPeriod(data),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_creation_successful));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (err, variables, onMutateResult, context) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
}

export function useDeleteClosedPeriod(options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => deleteClosedPeriod(id),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: closedPeriodKeys.all });
      toast.success(t(KEY.common_delete_successful));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (err, variables, onMutateResult, context) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
}
