import axios from 'axios';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button, Checkbox, Input } from '~/Components';
import { getSiteBanner, postSiteBanner, putSiteBanner } from '~/api';
import type { SiteBannerWriteDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SiteBannerFormAdminPage.module.scss';

function toLocalDateTime(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}

export function SiteBannerFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(id !== undefined);
  const [submitting, setSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string | undefined>();
  const [form, setForm] = useState({
    text_nb: '',
    text_en: '',
    url: '',
    new_tab: false,
    start_at: '',
    end_at: '',
  });
  const title = id ? t(KEY.admin_site_banner_edit) : t(KEY.admin_site_banner_new);
  useTitle(title);

  useEffect(() => {
    if (!id) return;
    getSiteBanner(id)
      .then((banner) =>
        setForm({
          text_nb: banner.text_nb,
          text_en: banner.text_en,
          url: banner.url ?? '',
          new_tab: banner.new_tab,
          start_at: toLocalDateTime(banner.start_at),
          end_at: toLocalDateTime(banner.end_at),
        }),
      )
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
        navigate({ url: ROUTES.frontend.admin_site_banners, replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate, t]);

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'url') {
      setUrlError(undefined);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.text_nb.trim() || !form.text_en.trim() || !form.start_at) {
      toast.error(t(KEY.common_required));
      return;
    }
    if (form.end_at && new Date(form.end_at) <= new Date(form.start_at)) {
      toast.error(t(KEY.admin_site_banner_end_after_start));
      return;
    }
    const data: SiteBannerWriteDto = {
      text_nb: form.text_nb,
      text_en: form.text_en,
      url: form.url || null,
      new_tab: form.new_tab,
      start_at: toIsoDateTime(form.start_at),
      end_at: form.end_at ? toIsoDateTime(form.end_at) : null,
    };
    setSubmitting(true);
    try {
      if (id) await putSiteBanner(id, data);
      else await postSiteBanner(data);
      toast.success(t(KEY.common_save_successful));
      navigate({ url: ROUTES.frontend.admin_site_banners });
    } catch (error) {
      const responseUrlError = axios.isAxiosError(error) ? error.response?.data?.url : undefined;
      const message = Array.isArray(responseUrlError) ? responseUrlError[0] : responseUrlError;
      if (typeof message === 'string') {
        setUrlError(message);
      } else {
        toast.error(t(KEY.common_something_went_wrong));
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPageLayout title={title} loading={loading}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="site-banner-text-nb" className={styles.fieldLabel}>
              {`${t(KEY.common_norwegian)} ${t(KEY.common_message)}`}
            </label>
            <Input
              id="site-banner-text-nb"
              value={form.text_nb}
              onChange={(event) => update('text_nb', event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="site-banner-text-en" className={styles.fieldLabel}>
              {`${t(KEY.common_english)} ${t(KEY.common_message)}`}
            </label>
            <Input
              id="site-banner-text-en"
              value={form.text_en}
              onChange={(event) => update('text_en', event.target.value)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="site-banner-url" className={styles.fieldLabel}>
              {t(KEY.common_url)}
            </label>
            <Input
              id="site-banner-url"
              type="text"
              value={form.url}
              onChange={(event) => update('url', event.target.value)}
            />
            {urlError && <span className={styles.fieldError}>{urlError}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="site-banner-start-at" className={styles.fieldLabel}>
              {t(KEY.start_time)}
            </label>
            <Input
              id="site-banner-start-at"
              type="datetime-local"
              value={form.start_at}
              onChange={(event) => update('start_at', event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="site-banner-end-at" className={styles.fieldLabel}>
              {t(KEY.end_time)}
            </label>
            <Input
              id="site-banner-end-at"
              type="datetime-local"
              value={form.end_at}
              onChange={(event) => update('end_at', event.target.value)}
            />
          </div>
        </div>
        <div className={styles.checkbox}>
          <Checkbox checked={form.new_tab} onChange={(event) => update('new_tab', event.target.checked)} />
          <span>{t(KEY.admin_site_banner_new_tab)}</span>
        </div>
        <Button type="submit" theme="primary" disabled={submitting}>
          {t(KEY.common_save)}
        </Button>
      </form>
    </AdminPageLayout>
  );
}
