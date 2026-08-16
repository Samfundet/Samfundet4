import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteEvent, postEvent, putEvent } from '~/api';
import type { EventWriteDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { eventKeys } from './queryKeys';

export function useCreateEvent(onCreate?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: Partial<EventWriteDto>) => postEvent(data),
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      onCreate?.();
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });
}

export function useUpdateEvent(onUpdate?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<EventWriteDto> }) => putEvent(id, data),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      onUpdate?.();
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });
}

export function useDeleteEvent(onDelete?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string | number) => deleteEvent(id),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      onDelete?.();
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });
}
