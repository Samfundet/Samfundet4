import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { deleteImage as apiDeleteImage, patchImage, postImage } from '~/api';
import { imageKeys, tagKeys } from '~/domain';
import type { ImagePatchDto, ImagePostDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';

export function useImageMutations() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createImage = useMutation({
    mutationFn: (data: ImagePostDto) => postImage(data),
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const editImage = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ImagePatchDto }) => patchImage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success(t(KEY.common_save_successful));
    },
    onError: (err) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error(err);
    },
  });

  const deleteImage = useMutation({
    mutationFn: (id: number) => apiDeleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success(t(KEY.common_delete_successful));
    },
    // biome-ignore lint/suspicious/noExplicitAny: axios error
    onError: (err: any) => {
      if (err.response?.status === STATUS.HTTP_409_CONFLICT) {
        toast.error(t(KEY.admin_images_delete_in_use));
      } else {
        toast.error(t(KEY.common_something_went_wrong));
      }
      console.error(err);
    },
  });

  return { createImage, editImage, deleteImage };
}
