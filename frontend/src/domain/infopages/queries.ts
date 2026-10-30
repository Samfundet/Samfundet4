import { skipToken, useQuery } from '@tanstack/react-query';
import type { Slug } from '../types';
import {
  getAdminInformationPage,
  getAdminInformationPageHistory,
  getAdminInformationPageRevision,
  getAdminInformationPages,
  getInformationPageOwnerOptions,
} from './api';
import { infoPageKeys } from './queryKeys';

export function useGetAdminInfoPages() {
  return useQuery({
    queryKey: infoPageKeys.list(),
    queryFn: getAdminInformationPages,
  });
}

export function useGetAdminInfoPage(slug: Slug) {
  return useQuery({
    queryKey: infoPageKeys.detail(slug),
    queryFn: () => getAdminInformationPage(slug),
    enabled: slug !== '',
  });
}

export function useGetInfoPageOwnerOptions() {
  return useQuery({
    queryKey: infoPageKeys.ownerOptions(),
    queryFn: getInformationPageOwnerOptions,
  });
}

export function useGetAdminInfoPageHistory(slug: Slug) {
  return useQuery({
    queryKey: infoPageKeys.history(slug),
    queryFn: () => getAdminInformationPageHistory(slug),
    enabled: slug !== '',
  });
}

export function useGetAdminInfoPageRevision(slug: Slug, version: number | undefined) {
  const canFetch = slug !== '' && version !== undefined;
  return useQuery({
    queryKey: infoPageKeys.revision(slug, version),
    queryFn: canFetch ? () => getAdminInformationPageRevision(slug, version) : skipToken,
  });
}
