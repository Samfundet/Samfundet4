import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Video } from '~/Components';
import type { EventDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { getSocialMediaUrl, getYouTubeVideoId } from '~/utils/socialMedia';
import styles from './EventSocialMedia.module.scss';

type Props = {
  event: EventDto;
};

export function EventSocialMedia({ event }: Props) {
  const { t } = useTranslation();
  const videoId = event.youtube_embed ? getYouTubeVideoId(event.youtube_link) : undefined;
  const links = [
    { label: 'Spotify', icon: 'mdi:spotify', value: event.spotify_uri },
    { label: 'YouTube', icon: 'mdi:youtube', value: event.youtube_link },
    { label: 'Facebook', icon: 'mdi:facebook', value: event.facebook_link },
    { label: 'SoundCloud', icon: 'mdi:soundcloud', value: event.soundcloud_link },
    { label: 'Instagram', icon: 'mdi:instagram', value: event.instagram_link },
    { label: 'X', icon: 'ri:twitter-x-fill', value: event.x_link },
    { label: 'Last.fm', icon: 'mdi:lastfm', value: event.lastfm_link },
    { label: 'Vimeo', icon: 'mdi:vimeo', value: event.vimeo_link },
    { label: t(KEY.event_general_link), icon: 'mdi:web', value: event.general_link },
  ]
    .map((link) => ({ ...link, url: getSocialMediaUrl(link.value) }))
    .filter((link) => link.url);

  if (!links.length && !videoId) return null;

  return (
    <div className={styles.container}>
      {links.length > 0 && (
        <ul className={styles.links}>
          {links.map(({ label, icon, url }) => (
            <li key={label}>
              <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <Icon icon={icon} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
      {videoId && <Video embedId={videoId} title={t(KEY.event_youtube_video)} />}
    </div>
  );
}
