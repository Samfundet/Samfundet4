/** Only web links are rendered as external event links. */
export function getSocialMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  const spotify = /^spotify:(track|artist|album|playlist):([a-zA-Z0-9]{22})$/.exec(value.trim());
  if (spotify) return `https://open.spotify.com/${spotify[1]}/${spotify[2]}`;

  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Extract a video ID without trusting a user-provided iframe URL. */
export function getYouTubeVideoId(value?: string | null): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return undefined;

    const host = url.hostname.replace(/^www\./, '');
    const parts = url.pathname.split('/').filter(Boolean);
    let id: string | null | undefined;
    if (host === 'youtu.be' && parts.length === 1) {
      id = parts[0];
    } else if (['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else if (parts.length === 2 && ['embed', 'shorts', 'live', 'v'].includes(parts[0])) id = parts[1];
    }

    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}
