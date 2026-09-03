import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { getAdminGangSections, getAdminGangTypes, getAdminGangs, getOrganizedGangList } from '~/api';
import { adminGangKeys, gangKeys } from '~/domain/gangs/queryKeys';
import type { AdminGangTypeDto, GangSectionDto } from '~/dto';

export function useGetOrganizedGangs() {
  return useQuery({
    queryKey: gangKeys.organized(),
    queryFn: getOrganizedGangList,
  });
}

export function useGetAdminGangs() {
  return useQuery({
    queryKey: adminGangKeys.all,
    queryFn: getAdminGangs,
  });
}

export function useGetAdminGangTypes(organizationId: number, props?: Partial<UseQueryOptions<AdminGangTypeDto[]>>) {
  return useQuery({
    queryKey: adminGangKeys.types(organizationId),
    queryFn: () => getAdminGangTypes(organizationId),
    ...props,
  });
}

export function useGetAdminGangSections(gangId: number, props?: Partial<UseQueryOptions<GangSectionDto[]>>) {
  return useQuery({
    queryKey: adminGangKeys.sections(gangId),
    queryFn: () => getAdminGangSections(gangId),
    ...props,
  });
}
