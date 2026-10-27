import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import { deleteGang, postGang, putGang } from './api';
import { gangKeys } from './queryKeys';
import type { EditGangDto } from './types';

export function useCreateGang() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: EditGangDto) => postGang(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: gangKeys.all });
    },
  });
}

export function useUpdateGang() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditGangDto }) => putGang(id, data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: gangKeys.all });
    },
  });
}

export function useDeleteGang() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => deleteGang(id),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: gangKeys.all });
    },
    onError: (err) => {
      // Backend explains why a gang can't be deleted (e.g. it still has sections)
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        toast.error(err.response.data.detail);
        return;
      }
      toast.error(t(KEY.common_something_went_wrong));
    },
  });
}
