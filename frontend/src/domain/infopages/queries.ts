import { skipToken, useQuery } from '@tanstack/react-query';
import {
  getAdminInformationPage,
  getAdminInformationPageHistory,
  getAdminInformationPageRevision,
  getAdminInformationPages,
  getInformationPage,
  getInformationPageOwnerOptions,
} from './api';
import { infoPageKeys } from './queryKeys';

export function useGetInfoPage(slug: string | undefined) {
  return useQuery({
    queryKey: infoPageKeys.public(slug),
    queryFn: slug !== undefined ? () => getInformationPage(slug) : skipToken,
  });
}

export function useGetAdminInfoPages() {
  return useQuery({
    queryKey: infoPageKeys.list(),
    queryFn: getAdminInformationPages,
  });
}

export function useGetAdminInfoPage(slug: string) {
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

export function useGetAdminInfoPageHistory(slug: string) {
  return useQuery({
    queryKey: infoPageKeys.history(slug),
    queryFn: () => getAdminInformationPageHistory(slug),
    enabled: slug !== '',
  });
}

export function useGetAdminInfoPageRevision(slug: string, version: number | undefined) {
  const canFetch = slug !== '' && version !== undefined;
  return useQuery({
    queryKey: infoPageKeys.revision(slug, version),
    queryFn: canFetch ? () => getAdminInformationPageRevision(slug, version) : skipToken,
  });
}
