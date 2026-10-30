import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import type { Slug } from '../types';
import { deleteInformationPage, postInformationPage, putInformationPage } from './api';
import { infoPageKeys } from './queryKeys';
import type { EditInformationPageDto } from './types';

export function useCreateInfoPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: EditInformationPageDto) => postInformationPage(data),
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      queryClient.invalidateQueries({ queryKey: infoPageKeys.all });
    },
  });
}

export function useUpdateInfoPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: Slug; data: EditInformationPageDto }) => putInformationPage(slug, data),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
      queryClient.invalidateQueries({ queryKey: infoPageKeys.all });
    },
  });
}

export function useDeleteInfoPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (slug: Slug) => deleteInformationPage(slug),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: infoPageKeys.all });
    },
  });
}
