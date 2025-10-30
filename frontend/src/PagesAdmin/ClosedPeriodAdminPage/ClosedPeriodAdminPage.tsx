import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, TimeDisplay, ToggleSwitch } from '~/Components';
import { Table } from '~/Components/Table';
import { deleteClosedPeriod, getClosedPeriods } from '~/api';
import type { ClosedPeriodDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodAdminPage.module.scss';
import { useGlobalContext } from '~/context/GlobalContextProvider';

export function ClosedPeriodAdminPage() {
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriodDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const globalContext = useGlobalContext();
  useTitle(t(KEY.command_menu_shortcut_closed));

  const getAllClosedPeriods = useCallback(() => {
    setShowSpinner(true);
    getClosedPeriods()
      .then((data) => {
        setClosedPeriods(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }, [t]);

  // Stuff to do on first render.
  // TODO add permissions on render

  useEffect(() => {
    getAllClosedPeriods();
  }, [getAllClosedPeriods]);

  function deleteSelectedEvent(id: number) {
    deleteClosedPeriod(id)
      .then(() => {
        getAllClosedPeriods();
        toast.success(t(KEY.common_delete_successful));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  const header = (
    <>
      <Button theme="success" rounded={true} link={ROUTES.frontend.admin_closed_create}>
        {t(KEY.admin_closed_period_new_period)}
      </Button>
      <span className={styles.admin_closed_switch}>
        Admin Closed
        <ToggleSwitch checked={globalContext.isClosed} onChange={() => globalContext.toggleIsClosed()}/>
      </span>
    </>
  );
  const backendUrl = ROUTES.backend.admin__samfundet_closedperiod_changelist;

  return (
    <AdminPageLayout
      title={t(KEY.admin_closed_period_title)}
      header={header}
      backendUrl={backendUrl}
      loading={showSpinner}
    >
      <div className={styles.tableContainer}>
        <Table
          columns={[
            t(KEY.common_message) ?? '',
            `Event ${t(KEY.common_message)}`,
            t(KEY.start_time) ?? '',
            t(KEY.end_time) ?? '',
            '',
          ]}
          data={closedPeriods.map((element) => ({
            cells: [
              element.message_nb,
              { content: <TimeDisplay displayType="date" timestamp={element.start_dt} /> },
              { content: <TimeDisplay displayType="date" timestamp={element.end_dt} /> },
              {
                content: (
                  <div>
                    <Button
                      theme="blue"
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
                      theme="samf"
                      display="block"
                      className={styles.smallButtons}
                      onClick={() => {
                        if (window.confirm(`${t(KEY.form_confirm)} ${t(KEY.common_delete)} ${element.message_nb}`)) {
                          deleteSelectedEvent(element.id);
                        }
                      }}
                    >
                      {t(KEY.common_delete)}
                    </Button>{' '}
                  </div>
                ),
              },
            ],
          }))}
        />
      </div>
    </AdminPageLayout>
  );
}
