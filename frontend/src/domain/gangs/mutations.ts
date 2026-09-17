import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteGang as apiDeleteGang, postGang, putGang } from '~/api';
import { gangKeys } from '~/domain';
import type { EditGangDto } from '~/dto';
import { KEY } from '~/i18n/constants';

export function useGangMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createGang = useMutation({
    mutationFn: (data: EditGangDto) => postGang(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const editGang = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditGangDto }) => putGang(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gangKeys.all });
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const deleteGang = useMutation({
    mutationFn: (id: number) => apiDeleteGang(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gangKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response && err.response.data.detail) {
        toast.error(err.response.data.detail);
        return;
      }
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  return {
    createGang,
    editGang,
    deleteGang,
  };
}
