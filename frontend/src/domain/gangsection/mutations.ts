import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import type { ID } from '../types';
import { deleteGangSection, postGangSection, putGangSection } from './api';
import { gangSectionKeys } from './queryKeys';
import type { EditGangSectionDto } from './types';

export function useCreateGangSection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: EditGangSectionDto) => postGangSection(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: gangSectionKeys.all });
    },
  });
}

export function useUpdateGangSection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: ID; data: EditGangSectionDto }) => putGangSection(id, data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: gangSectionKeys.all });
    },
  });
}

export function useDeleteGangSection() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: ID) => deleteGangSection(id),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: gangSectionKeys.all });
    },
  });
}
