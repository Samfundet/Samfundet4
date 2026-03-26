import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import { KEY } from '~/i18n/constants';
import styles from '../EventCreatorAdminPage.module.scss';
import type { EventFormType } from '../EventCreatorSchema';
import type { FormType } from '../hooks/useEventCreatorForm';

type SocialLinkKey = Extract<
  keyof EventFormType,
  | 'spotify_uri'
  | 'youtube_link'
  | 'youtube_embed'
  | 'facebook_link'
  | 'soundcloud_link'
  | 'instagram_link'
  | 'x_link'
  | 'lastfm_link'
  | 'vimeo_link'
  | 'general_link'
>;

type Props = {
  form: UseFormReturn<FormType>;
};

const SOCIAL_KEYS: readonly SocialLinkKey[] = [
  'spotify_uri',
  'youtube_link',
  'youtube_embed',
  'facebook_link',
  'soundcloud_link',
  'instagram_link',
  'x_link',
  'lastfm_link',
  'vimeo_link',
  'general_link',
] as const;

export function SocialMediaStep({ form }: Props) {
  const { t } = useTranslation();

  const SOCIAL_LABELS: Record<SocialLinkKey, string> = {
    spotify_uri: 'Spotify URI',
    youtube_link: 'YouTube link',
    youtube_embed: 'YouTube embed',
    facebook_link: 'Facebook link',
    soundcloud_link: 'SoundCloud link',
    instagram_link: 'Instagram link',
    x_link: 'X link',
    lastfm_link: 'Last.fm link',
    vimeo_link: 'Vimeo link',
    general_link: t(KEY.event_general_link),
  };

  const SOCIAL_MEDIA_HELP: Partial<Record<SocialLinkKey, string>> = {
    spotify_uri: t(KEY.event_spotify_uri_help),
    youtube_link: t(KEY.event_youtube_link_help),
    youtube_embed: t(KEY.event_youtube_embed_help),
  };

  return (
    <>
      <div className={styles.socialMediaGrid}>
        {SOCIAL_KEYS.map((name) => (
          <FormField
            key={name}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem className={styles.socialMediaItem}>
                <FormLabel className={styles.socialMediaLabel}>{SOCIAL_LABELS[name]}</FormLabel>
                <FormControl>
                  <Input
                    className={styles.socialMediaInput}
                    type="text"
                    {...field}
                    placeholder={name === 'spotify_uri' ? 'spotify:...' : 'https://...'}
                  />
                </FormControl>
                {SOCIAL_MEDIA_HELP[name] ? <FormDescription>{SOCIAL_MEDIA_HELP[name]}</FormDescription> : null}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </>
  );
}
