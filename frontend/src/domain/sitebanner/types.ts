import type { z } from 'zod';
import type { siteBannerSchema } from './schema';

export type SiteBannerDto = {
  id: number;
  version: number;
  text_nb: string;
  text_en: string;
  url: string | null;
  new_tab: boolean;
  start_at: string;
  end_at: string | null;
};

export type SiteBannerWriteDto = Omit<SiteBannerDto, 'id' | 'version' | 'end_at'> & {
  end_at: string;
};

export type SiteBannerFormValues = z.infer<typeof siteBannerSchema>;
