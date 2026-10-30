import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import type { ID } from '../types';
import { defaultOnError } from '../utils';
import { deleteImage, patchImage, postImage } from './api';
import { imageKeys } from './queryKeys';
import type { ImagePatchDto, ImagePostDto } from './types';

export function useCreateImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ImagePostDto) => postImage(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: ID; data: ImagePatchDto }) => patchImage(id, data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: ID) => deleteImage(id),
    onSuccess: () => {
      toast.success(t(KEY.common_delete_successful));
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === STATUS.HTTP_409_CONFLICT) {
        toast.error(t(KEY.admin_images_delete_in_use));
        console.log(err);
        return;
      }
      defaultOnError(err);
    },
  });
}
