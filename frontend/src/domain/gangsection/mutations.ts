import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteGangSection as apiDeleteGangSection, postGangSection, putGangSection } from '~/api';
import { adminGangSectionKeys } from '~/domain/gangsection/queryKeys';
import type { EditGangSectionDto } from '~/dto';
import { KEY } from '~/i18n/constants';

export function useGangSectionMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createGangSection = useMutation({
    mutationFn: (data: EditGangSectionDto) => postGangSection(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const editGangSection = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditGangSectionDto }) => putGangSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGangSectionKeys.all });
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const deleteGangSection = useMutation({
    mutationFn: (id: number) => apiDeleteGangSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGangSectionKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  return {
    createGangSection,
    editGangSection,
    deleteGangSection,
  };
}
