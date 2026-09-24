import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Modal,
  ToggleSwitch,
  Video,
} from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import { KEY } from '~/i18n/constants';
import { getYouTubeVideoId } from '~/utils/socialMedia';
import styles from '../EventCreatorAdminPage.module.scss';
import type { EventFormType } from '../EventCreatorSchema';
import type { FormType } from '../hooks/useEventCreatorForm';

type SocialLinkKey = Extract<
  keyof EventFormType,
  | 'spotify_uri'
  | 'youtube_link'
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

export const SOCIAL_KEYS: readonly SocialLinkKey[] = [
  'spotify_uri',
  'youtube_link',
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const videoId = getYouTubeVideoId(form.watch('youtube_link'));

  const SOCIAL_LABELS: Record<SocialLinkKey, string> = {
    spotify_uri: 'Spotify URI',
    youtube_link: `YouTube ${t(KEY.common_link)}`,
    facebook_link: `Facebook ${t(KEY.common_link)}`,
    soundcloud_link: `SoundCloud ${t(KEY.common_link)}`,
    instagram_link: `Instagram ${t(KEY.common_link)}`,
    x_link: `X ${t(KEY.common_link)}`,
    lastfm_link: `Last.fm ${t(KEY.common_link)}`,
    vimeo_link: `Vimeo ${t(KEY.common_link)}`,
    general_link: t(KEY.event_general_link),
  };

  const SOCIAL_MEDIA_HELP: Partial<Record<SocialLinkKey, string>> = {
    spotify_uri: t(KEY.event_spotify_uri_help),
    youtube_link: t(KEY.event_youtube_link_help),
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
                <FormLabel>{SOCIAL_LABELS[name]}</FormLabel>
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
                {name === 'youtube_link' && (
                  <>
                    <FormField
                      name="youtube_embed"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className={styles.socialMediaItem}>
                          <div className={styles.embedSwitchRow}>
                            <FormLabel>{t(KEY.event_youtube_embed)}</FormLabel>
                            <FormControl>
                              <ToggleSwitch
                                name={field.name}
                                ref={field.ref}
                                checked={field.value ?? false}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  void form.trigger('youtube_link');
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>{t(KEY.event_youtube_embed_help)}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" disabled={!videoId} onClick={() => setPreviewOpen(true)}>
                      {t(KEY.common_preview)}
                    </Button>
                  </>
                )}
              </FormItem>
            )}
          />
        ))}
      </div>
      <Modal
        isOpen={previewOpen && !!videoId}
        onRequestClose={() => setPreviewOpen(false)}
        contentLabel={t(KEY.event_youtube_video)}
        className={styles.youtubePreviewModal}
      >
        {videoId && <Video embedId={videoId} title={t(KEY.event_youtube_video)} />}
        <Button type="button" onClick={() => setPreviewOpen(false)}>
          {t(KEY.common_close)}
        </Button>
      </Modal>
    </>
  );
}
