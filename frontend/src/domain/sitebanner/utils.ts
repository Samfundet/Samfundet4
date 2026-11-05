import type { SiteBannerFormValues, SiteBannerWriteDto } from './types';

export function normalizeBannerUrl(value: string): string {
  const url = value.trim();
  const samfundetHost = /^(?:www\.)?samfundet\.no(?=\/|[?#]|$)/i;
  if (!samfundetHost.test(url)) return url;

  const path = url.replace(samfundetHost, '');
  return path.startsWith('/') ? path : `/${path}`;
}

export function isValidBannerUrl(value: string): boolean {
  const normalized = normalizeBannerUrl(value);
  if (normalized === '') return true;
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Browsers strip control characters when parsing URLs.
  if (/[\u0000-\u0020\u007f\\]/.test(normalized)) return false;
  if (normalized.startsWith('/')) return !normalized.startsWith('//');
  if (!/^https?:\/\//i.test(normalized)) return false;

  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function toSiteBannerWriteDto(data: SiteBannerFormValues): SiteBannerWriteDto {
  const url = normalizeBannerUrl(data.url);

  return {
    text_nb: data.text_nb,
    text_en: data.text_en,
    url: url || null,
    new_tab: Boolean(url) && data.new_tab,
    start_at: new Date(data.start_at).toISOString(),
    end_at: new Date(data.end_at).toISOString(),
  };
}
