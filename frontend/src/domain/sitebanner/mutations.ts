import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEY } from '~/i18n/constants';
import { postSiteBanner } from './api';
import { siteBannerKeys } from './queryKeys';
import type { SiteBannerFormValues } from './types';
import { toSiteBannerWriteDto } from './utils';

export function useCreateSiteBanner() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: SiteBannerFormValues) => postSiteBanner(toSiteBannerWriteDto(data)),
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      queryClient.invalidateQueries({ queryKey: siteBannerKeys.all });
    },
  });
}
