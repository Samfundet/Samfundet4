import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { postSiteBanner } from './api';
import { siteBannerKeys } from './queryKeys';
import type { SiteBannerDto, SiteBannerFormValues, SiteBannerWriteDto } from './types';
import { normalizeBannerUrl } from './utils';

type CreateSiteBannerOptions = Pick<
  UseMutationOptions<
    SiteBannerDto,
    AxiosError<Partial<Record<keyof SiteBannerFormValues, string[]>>>,
    SiteBannerFormValues
  >,
  'onError' | 'onSuccess'
>;

function toSiteBannerWriteDto(data: SiteBannerFormValues): SiteBannerWriteDto {
  const url = normalizeBannerUrl(data.url);

  return {
    text_nb: data.text_nb,
    text_en: data.text_en,
    url: url || null,
    new_tab: Boolean(url) && data.new_tab,
    start_at: new Date(data.start_at).toISOString(),
    end_at: new Date(data.end_at).toISOString(),
  };
}

export function useCreateSiteBanner(options: CreateSiteBannerOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiteBannerFormValues) => postSiteBanner(toSiteBannerWriteDto(data)),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: siteBannerKeys.all });
      await options.onSuccess?.(...args);
    },
    onError: options.onError,
  });
}
