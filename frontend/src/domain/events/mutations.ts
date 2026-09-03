import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { EventWriteDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { onError } from '../utils';
import { deleteEvent, postEvent, putEvent } from './api';
import { eventKeys } from './queryKeys';

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: Partial<EventWriteDto>) => postEvent(data),
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    onError,
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<EventWriteDto> }) => putEvent(id, data),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    onError,
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string | number) => deleteEvent(id),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    onError,
  });
}
