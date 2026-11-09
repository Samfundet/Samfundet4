import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getPopularTags, getTags } from './api';
import { tagKeys } from './queryKeys';
import type { TagDto } from './types';

export function useGetTags(props?: Partial<UseQueryOptions<TagDto[]>>) {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: getTags,
    ...props,
  });
}

export function useGetPopularTags(props?: Partial<UseQueryOptions<TagDto[]>>) {
  return useQuery({
    queryKey: tagKeys.popular(),
    queryFn: getPopularTags,
    ...props,
  });
}
