import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getAdminGangTypes, getAdminGangs, getOrganizedGangList } from './api';
import { gangKeys } from './queryKeys';
import type { AdminGangListOrganizationDto, AdminGangTypeDto, GangTypeDto } from './types';

export function useGetOrganizedGangs(props?: Partial<UseQueryOptions<GangTypeDto[]>>) {
  return useQuery({
    queryKey: gangKeys.organized(),
    queryFn: getOrganizedGangList,
    ...props,
  });
}

export function useGetAdminGangs(props?: Partial<UseQueryOptions<AdminGangListOrganizationDto[]>>) {
  return useQuery({
    queryKey: gangKeys.admin(),
    queryFn: getAdminGangs,
    ...props,
  });
}

export function useGetAdminGangTypes(organizationId: number, props?: Partial<UseQueryOptions<AdminGangTypeDto[]>>) {
  return useQuery({
    queryKey: gangKeys.adminTypes(organizationId),
    queryFn: () => getAdminGangTypes(organizationId),
    ...props,
  });
}
