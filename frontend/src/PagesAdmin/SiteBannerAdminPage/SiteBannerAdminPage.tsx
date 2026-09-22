import { Icon } from '@iconify/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, TimeDisplay } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Table } from '~/Components/Table';
import { deleteSiteBanner, getSiteBanners } from '~/api';
import type { SiteBannerDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './SiteBannerAdminPage.module.scss';

export function SiteBannerAdminPage() {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const [banners, setBanners] = useState<SiteBannerDto[]>([]);
  const [loading, setLoading] = useState(true);
  useTitle(t(KEY.admin_site_banner_title));

  const loadBanners = useCallback(() => {
    setLoading(true);
    getSiteBanners()
      .then(setBanners)
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  function handleDelete(banner: SiteBannerDto) {
    deleteSiteBanner(banner.id)
      .then(() => {
        toast.success(t(KEY.common_delete_successful));
        loadBanners();
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  return (
    <AdminPageLayout
      title={t(KEY.admin_site_banner_title)}
      backendUrl={ROUTES.backend.admin__samfundet_sitebanner_changelist}
      loading={loading}
      header={
        <Button theme="primary" link={ROUTES.frontend.admin_site_banners_create}>
          <Icon icon="lucide:plus" />
          {t(KEY.admin_site_banner_new)}
        </Button>
      }
    >
      <div className={styles.tableContainer}>
        <Table
          columns={[t(KEY.common_message), t(KEY.start_time), t(KEY.end_time), '']}
          data={banners.map((banner) => ({
            cells: [
              banner.text_nb,
              { content: <TimeDisplay timestamp={banner.start_at} />, value: banner.start_at },
              {
                content: banner.end_at ? <TimeDisplay timestamp={banner.end_at} /> : t(KEY.common_no),
                value: banner.end_at ?? '',
              },
              {
                content: (
                  <CrudButtons
                    onEdit={() =>
                      navigate({
                        url: reverse({
                          pattern: ROUTES.frontend.admin_site_banners_edit,
                          urlParams: { id: banner.id },
                        }),
                      })
                    }
                    onDelete={() => {
                      const message = lowerCapitalize(`${t(KEY.form_confirm)} ${t(KEY.common_delete)}`);
                      if (window.confirm(`${message} ${banner.text_nb}`)) {
                        handleDelete(banner);
                      }
                    }}
                  />
                ),
              },
            ],
          }))}
        />
      </div>
    </AdminPageLayout>
  );
}
