import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Checkbox, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import { postSiteBanner } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { utcTimestampToLocal } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SiteBannerAdminPage.module.scss';

const MAX_TEXT_LENGTH = 128;

function isValidBannerUrl(value: string): boolean {
  if (value === '') return true;
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const siteBannerSchema = z
  .object({
    text_nb: z.string().trim().min(1, KEY.common_required).max(MAX_TEXT_LENGTH, KEY.admin_site_banner_text_hint),
    text_en: z.string().trim().min(1, KEY.common_required).max(MAX_TEXT_LENGTH, KEY.admin_site_banner_text_hint),
    url: z.string().trim().refine(isValidBannerUrl, KEY.admin_site_banner_validation_url).optional().default(''),
    new_tab: z.boolean().default(false),
    start_at: z.string().min(1, KEY.common_required),
    end_at: z.string().min(1, KEY.common_required),
  })
  .superRefine((values, context) => {
    if (new Date(values.end_at) <= new Date(values.start_at)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: KEY.admin_site_banner_validation_end,
        path: ['end_at'],
      });
    }
  });

type SiteBannerFormValues = z.infer<typeof siteBannerSchema>;

function getDefaultValues(): SiteBannerFormValues {
  return {
    text_nb: '',
    text_en: '',
    url: '',
    new_tab: false,
    start_at: utcTimestampToLocal(new Date().toISOString(), false),
    end_at: '',
  };
}

export function SiteBannerAdminPage() {
  const { t } = useTranslation();
  const form = useForm<SiteBannerFormValues>({
    resolver: zodResolver(siteBannerSchema),
    defaultValues: getDefaultValues(),
  });
  const values = form.watch();

  useTitle(t(KEY.admin_site_banner_title));

  const createSiteBanner = useMutation({
    mutationFn: postSiteBanner,
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      form.reset(getDefaultValues());
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Unable to create site banner:', error);
    },
  });

  function onSubmit(data: SiteBannerFormValues) {
    const url = data.url.trim();
    createSiteBanner.mutate({
      text_nb: data.text_nb,
      text_en: data.text_en,
      url: url || null,
      new_tab: Boolean(url) && data.new_tab,
      start_at: new Date(data.start_at).toISOString(),
      end_at: new Date(data.end_at).toISOString(),
    });
  }

  const hasLink = Boolean(values.url.trim());
  const previews = [
    {
      language: t(KEY.common_norwegian),
      text: values.text_nb,
    },
    {
      language: t(KEY.common_english),
      text: values.text_en,
    },
  ];

  return (
    <AdminPageLayout
      title={t(KEY.admin_site_banner_title)}
      backendUrl={ROUTES.backend.admin__samfundet_sitebanner_changelist}
      header={<p className={styles.description}>{t(KEY.admin_site_banner_description)}</p>}
    >
      <div className={styles.container}>
        <Form {...form} schema={siteBannerSchema}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className={styles.field_grid}>
              <FormField
                control={form.control}
                name="text_nb"
                disabled={createSiteBanner.isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.common_norwegian)}</FormLabel>
                    <FormDescription>{t(KEY.admin_site_banner_text_hint)}</FormDescription>
                    <FormControl>
                      <Input type="text" maxLength={MAX_TEXT_LENGTH} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_en"
                disabled={createSiteBanner.isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.common_english)}</FormLabel>
                    <FormDescription>{t(KEY.admin_site_banner_text_hint)}</FormDescription>
                    <FormControl>
                      <Input type="text" maxLength={MAX_TEXT_LENGTH} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <section className={styles.preview_section} aria-labelledby="site-banner-preview-title">
              <h2 id="site-banner-preview-title">{t(KEY.admin_site_banner_preview)}</h2>
              <div className={styles.preview_list}>
                {previews.map((preview) => (
                  <div key={preview.language} className={styles.preview_item}>
                    <span className={styles.language}>{preview.language}</span>
                    <div className={styles.banner}>
                      <span
                        className={classNames(
                          styles.preview_text,
                          hasLink && styles.preview_link,
                          !preview.text && styles.placeholder,
                        )}
                      >
                        {preview.text || t(KEY.admin_site_banner_preview_placeholder)}
                      </span>
                      {hasLink && values.new_tab && (
                        <Icon icon="lucide:external-link" className={styles.external_icon} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <FormField
              control={form.control}
              name="url"
              disabled={createSiteBanner.isPending}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.admin_site_banner_url)}</FormLabel>
                  <FormDescription>{t(KEY.admin_site_banner_url_hint)}</FormDescription>
                  <FormControl>
                    <Input type="text" inputMode="url" placeholder="/events/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_tab"
              disabled={createSiteBanner.isPending}
              render={({ field }) => (
                <FormItem className={styles.checkbox_item}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      disabled={createSiteBanner.isPending}
                    />
                  </FormControl>
                  <div className={styles.checkbox_copy}>
                    <FormLabel className={styles.checkbox_label}>{t(KEY.admin_site_banner_new_tab)}</FormLabel>
                    <FormDescription>{t(KEY.admin_site_banner_new_tab_hint)}</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className={styles.field_grid}>
              <FormField
                control={form.control}
                name="start_at"
                disabled={createSiteBanner.isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.admin_site_banner_start_at)}</FormLabel>
                    <FormDescription>{t(KEY.admin_site_banner_start_at_hint)}</FormDescription>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_at"
                disabled={createSiteBanner.isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.admin_site_banner_end_at)}</FormLabel>
                    <FormDescription>{t(KEY.admin_site_banner_end_at_hint)}</FormDescription>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={styles.action_row}>
              <Button type="submit" theme="primary" disabled={createSiteBanner.isPending}>
                <Icon icon={createSiteBanner.isPending ? 'svg-spinners:ring-resize' : 'lucide:plus'} />
                {t(KEY.common_create)}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
