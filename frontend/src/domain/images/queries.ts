import { type UseQueryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { PageNumberPaginationType } from '~/types';
import { getImage, getImagesPaginated } from './api';
import { imageKeys } from './queryKeys';
import type { ImageDto } from './types';

export function useGetImagesPaginated(
  page: number,
  pageSize?: number,
  search?: string,
  tag?: string,
  props?: Partial<UseQueryOptions<PageNumberPaginationType<ImageDto>>>,
) {
  return useQuery({
    queryKey: imageKeys.list(page, pageSize, search, tag),
    queryFn: () => getImagesPaginated(page, pageSize, search, tag),
    ...props,
  });
}

export function useGetImage(id: string | number | undefined) {
  const canFetch = id !== undefined;
  return useQuery({
    queryKey: imageKeys.detail(id),
    queryFn: canFetch ? () => getImage(id) : skipToken,
  });
}
