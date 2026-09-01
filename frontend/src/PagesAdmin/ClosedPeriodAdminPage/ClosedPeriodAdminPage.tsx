import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button, TimeDisplay } from '~/Components';
import { Table } from '~/Components/Table';
import { useDeleteClosedPeriod, useGetClosedPeriods } from '~/domain';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodAdminPage.module.scss';

export function ClosedPeriodAdminPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.command_menu_shortcut_closed));

  const { data: closedPeriods, isLoading } = useGetClosedPeriods();
  const { mutate: deleteClosedPeriod } = useDeleteClosedPeriod();

  const header = (
    <Button theme="primary" link={ROUTES.frontend.admin_closed_create}>
      <Icon icon="lucide:plus" />
      {t(KEY.admin_closed_period_new_period)}
    </Button>
  );
  const backendUrl = ROUTES.backend.admin__samfundet_closedperiod_changelist;

  return (
    <AdminPageLayout
      title={t(KEY.admin_closed_period_title)}
      header={header}
      backendUrl={backendUrl}
      loading={isLoading}
    >
      <div className={styles.tableContainer}>
        <Table
          columns={[
            `${t(KEY.common_message)} ${t(KEY.common_norwegian)}`,
            `${t(KEY.common_message)} ${t(KEY.common_english)}`,
            t(KEY.start_time) ?? '',
            t(KEY.end_time) ?? '',
            t(KEY.common_edit) ?? '',
          ]}
          data={
            closedPeriods
              ? closedPeriods.map((element) => ({
                  cells: [
                    element.message_nb,
                    element.message_en,
                    { content: <TimeDisplay displayType="date" timestamp={element.start_dt} /> },
                    { content: <TimeDisplay displayType="date" timestamp={element.end_dt} /> },
                    {
                      content: (
                        <div className={styles.edit_buttons}>
                          <Button
                            theme="secondary"
                            display="block"
                            className={styles.smallButtons}
                            link={reverse({
                              pattern: ROUTES.frontend.admin_closed_edit,
                              urlParams: { id: element.id },
                            })}
                          >
                            {t(KEY.common_edit)}
                          </Button>
                          <Button
                            theme="primary"
                            display="block"
                            className={styles.smallButtons}
                            onClick={() => {
                              // :TODO: window.confirm should be replaced with a non-browser implementation (not built-in popup)
                              if (
                                window.confirm(`${t(KEY.form_confirm)} ${t(KEY.common_delete)} ${element.message_nb}`)
                              ) {
                                deleteClosedPeriod(element.id);
                              }
                            }}
                          >
                            {t(KEY.common_delete)}
                          </Button>{' '}
                        </div>
                      ),
                    },
                  ],
                }))
              : []
          }
        />
      </div>
    </AdminPageLayout>
  );
}
