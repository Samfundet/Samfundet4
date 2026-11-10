import { type UseQueryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { getAdminGang, getAdminGangTypes, getAdminGangs, getOrganizedGangList } from './api';
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

export function useGetAdminGang(id: string | number | undefined) {
  return useQuery({
    queryKey: gangKeys.adminDetail(id),
    queryFn: id !== undefined ? () => getAdminGang(id) : skipToken,
  });
}

export function useGetAdminGangTypes(
  organizationId: string | number,
  props?: Partial<UseQueryOptions<AdminGangTypeDto[]>>,
) {
  return useQuery({
    queryKey: gangKeys.adminTypes(organizationId),
    queryFn: () => getAdminGangTypes(organizationId),
    ...props,
  });
}
