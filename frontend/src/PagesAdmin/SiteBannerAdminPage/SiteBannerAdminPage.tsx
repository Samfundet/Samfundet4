import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Checkbox, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import { SiteBannerContent } from '~/Components/SiteBanner/SiteBannerContent';
import {
  MAX_TEXT_LENGTH,
  MAX_URL_LENGTH,
  type SiteBannerFormValues,
  getDefaultSiteBannerFormValues,
  isValidBannerUrl,
  normalizeBannerUrl,
  siteBannerSchema,
  useCreateSiteBanner,
} from '~/domain';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SiteBannerAdminPage.module.scss';

export function SiteBannerAdminPage() {
  const { t } = useTranslation();
  const form = useForm<SiteBannerFormValues>({
    resolver: zodResolver(siteBannerSchema),
    defaultValues: getDefaultSiteBannerFormValues(),
    mode: 'onBlur',
  });
  const values = form.watch();

  useTitle(t(KEY.admin_site_banner_title));

  const createSiteBanner = useCreateSiteBanner({
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      form.reset(getDefaultSiteBannerFormValues());
    },
    onError: (error) => {
      if (axios.isAxiosError<Partial<Record<keyof SiteBannerFormValues, string[]>>>(error)) {
        const errors = error.response?.data;
        if (error.response?.status === 400 && errors) {
          let hasFieldError = false;
          for (const name of Object.keys(getDefaultSiteBannerFormValues()) as (keyof SiteBannerFormValues)[]) {
            const messages = errors[name];
            if (Array.isArray(messages) && messages.length > 0) {
              form.setError(name, { type: 'server', message: messages.join(' ') });
              hasFieldError = true;
            }
          }
          if (hasFieldError) return;
        }
      }
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Unable to create site banner:', error);
    },
  });

  const isPending = createSiteBanner.isPending;
  const previewUrl = isValidBannerUrl(values.url) ? normalizeBannerUrl(values.url) : '';
  const previews = [
    {
      language: t(KEY.common_norwegian),
      text: values.text_nb.trim(),
    },
    {
      language: t(KEY.common_english),
      text: values.text_en.trim(),
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
          <form className={styles.form} onSubmit={form.handleSubmit((data) => createSiteBanner.mutate(data))}>
            <div className={styles.field_grid}>
              <FormField
                control={form.control}
                name="text_nb"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.common_norwegian)}</FormLabel>
                    {values.text_nb.length >= MAX_TEXT_LENGTH && (
                      <FormDescription>{t(KEY.admin_site_banner_text_hint)}</FormDescription>
                    )}
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
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.common_english)}</FormLabel>
                    {values.text_en.length >= MAX_TEXT_LENGTH && (
                      <FormDescription>{t(KEY.admin_site_banner_text_hint)}</FormDescription>
                    )}
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
                    <SiteBannerContent
                      preview
                      text={preview.text || t(KEY.admin_site_banner_preview_placeholder)}
                      url={previewUrl}
                      newTab={values.new_tab}
                    />
                  </div>
                ))}
              </div>
            </section>

            <FormField
              control={form.control}
              name="url"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.admin_site_banner_url)}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="url"
                      maxLength={MAX_URL_LENGTH}
                      placeholder="samfundet.no/events/"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_tab"
              disabled={isPending || !previewUrl}
              render={({ field }) => (
                <FormItem className={styles.checkbox_item}>
                  <FormControl>
                    <Checkbox
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      disabled={isPending || !previewUrl}
                    />
                  </FormControl>
                  <div className={styles.checkbox_copy}>
                    <FormLabel className={styles.checkbox_label}>{t(KEY.admin_site_banner_new_tab)}</FormLabel>
                    {!previewUrl && <FormDescription>{t(KEY.admin_site_banner_new_tab_hint)}</FormDescription>}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className={styles.field_grid}>
              <FormField
                control={form.control}
                name="start_at"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.admin_site_banner_start_at)}</FormLabel>
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
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className={styles.form_item}>
                    <FormLabel>{t(KEY.admin_site_banner_end_at)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={styles.action_row}>
              <Button type="submit" theme="primary" disabled={isPending}>
                <Icon icon={isPending ? 'svg-spinners:ring-resize' : 'lucide:plus'} />
                {t(KEY.common_create)}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
