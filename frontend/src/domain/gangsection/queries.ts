import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getAdminGangSections } from './api';
import { gangSectionKeys } from './queryKeys';
import type { GangSectionDto } from './types';

export function useGetAdminGangSections(id: string | number, props?: Partial<UseQueryOptions<GangSectionDto[]>>) {
  return useQuery({
    queryKey: gangSectionKeys.byGang(id),
    queryFn: () => getAdminGangSections(id),
    ...props,
  });
}
