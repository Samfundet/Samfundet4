import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getHomeData } from './api';
import { homeKeys } from './queryKeys';
import type { HomePageDto } from './types';

export function useGetHomeData(props?: Partial<UseQueryOptions<HomePageDto>>) {
  return useQuery({
    queryKey: homeKeys.all,
    queryFn: getHomeData,
    ...props,
  });
}
