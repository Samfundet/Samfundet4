import { useQuery } from '@tanstack/react-query';
import {
  getAdminInformationPage,
  getAdminInformationPageHistory,
  getAdminInformationPageRevision,
  getAdminInformationPages,
  getInformationPageOwnerOptions,
} from '~/api';
import { infoPageKeys } from '~/domain';

export function useGetAdminInfoPages() {
  return useQuery({
    queryKey: infoPageKeys.all,
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
  return useQuery({
    queryKey: infoPageKeys.revision(slug, version as number),
    // biome-ignore lint/style/noNonNullAssertion: enabled keeps this from running without a version
    queryFn: () => getAdminInformationPageRevision(slug, version!),
    enabled: slug !== '' && version !== undefined,
  });
}
