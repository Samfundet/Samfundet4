import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getActiveSiteBanner } from './api';
import { siteBannerKeys } from './queryKeys';

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export function useGetActiveSiteBanner() {
  const [expiredEndAt, setExpiredEndAt] = useState<string | null>(null);
  const query = useQuery({
    queryKey: siteBannerKeys.active(),
    queryFn: getActiveSiteBanner,
    select: (banner) => (banner?.end_at && banner.end_at === expiredEndAt ? null : banner),
  });
  const endAt = query.data?.end_at;
  const { refetch } = query;

  useEffect(() => {
    if (!endAt) return;

    // The active endpoint includes banners at their exact end time.
    const expiresAt = Date.parse(endAt) + 1;
    let timeout: number;

    const scheduleExpiry = () => {
      const delay = Math.min(Math.max(0, expiresAt - Date.now()), MAX_TIMEOUT_MS);
      timeout = window.setTimeout(() => {
        if (Date.now() < expiresAt) {
          scheduleExpiry();
          return;
        }

        setExpiredEndAt(endAt);
        void refetch();
      }, delay);
    };

    scheduleExpiry();
    return () => window.clearTimeout(timeout);
  }, [endAt, refetch]);

  return query;
}
