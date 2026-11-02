import { useQuery } from '@tanstack/react-query';
import { MINUTE_MILLIS } from '~/constants';
import { getActiveSiteBanner } from './api';
import { siteBannerKeys } from './queryKeys';

export function useGetActiveSiteBanner() {
  return useQuery({
    queryKey: siteBannerKeys.active(),
    queryFn: getActiveSiteBanner,
    refetchInterval: MINUTE_MILLIS,
  });
}
