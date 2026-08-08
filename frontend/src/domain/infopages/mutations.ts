import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteInformationPage, postInformationPage, putInformationPage } from '~/api';
import { infoPageKeys } from '~/domain';
import type { EditInformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';

export function useInfoPageMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createInfoPage = useMutation({
    mutationFn: postInformationPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: infoPageKeys.all });
      toast.success(t(KEY.common_creation_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const editInfoPage = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: EditInformationPageDto }) => putInformationPage(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: infoPageKeys.all });
      toast.success(t(KEY.common_update_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const deleteInfoPage = useMutation({
    mutationFn: deleteInformationPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: infoPageKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  return { createInfoPage, editInfoPage, deleteInfoPage };
}
