import { utcTimestampToLocal } from '~/utils';
import type { SiteBannerFormValues } from './types';

export function getDefaultSiteBannerFormValues(): SiteBannerFormValues {
  return {
    text_nb: '',
    text_en: '',
    url: '',
    new_tab: false,
    start_at: utcTimestampToLocal(new Date().toISOString(), false),
    end_at: '',
  };
}
