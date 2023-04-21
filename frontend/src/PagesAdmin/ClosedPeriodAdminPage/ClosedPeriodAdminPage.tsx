import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { Table } from '~/Components/Table';
import { deleteClosedPeriod, getClosedPeriods } from '~/api';
import { ClosedPeriodDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodAdminPage.module.scss';

export function ClosedPeriodAdminPage() {
  const navigate = useNavigate();
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriodDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

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
    <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_closed_create)}>
      {t(KEY.admin_closed_period_new_period)}
    </Button>
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
            'Event ' + t(KEY.common_message),
            t(KEY.start_time) ?? '',
            t(KEY.end_time) ?? '',
            '',
          ]}
          data={closedPeriods.map(function (element) {
            return [
              element.message_no,
              element.description_no,
              // { content: <TimeDisplay displayType="date" timestamp={element.start_dt} /> },
              element.start_dt.toLocaleString(),
              // { content: <TimeDisplay displayType="date" timestamp={element.end_dt} /> },
              element.end_dt.toLocaleString(),
              {
                content: (
                  <div>
                    <Button
                      theme="blue"
                      display="block"
                      className={styles.smallButtons}
                      onClick={() => {
                        navigate(
                          reverse({
                            pattern: ROUTES.frontend.admin_closed_edit,
                            urlParams: { id: element.id },
                          }),
                        );
                      }}
                    >
                      {t(KEY.common_edit)}
                    </Button>
                    <Button
                      theme="samf"
                      display="block"
                      className={styles.smallButtons}
                      onClick={() => {
                        if (window.confirm(`${t(KEY.form_confirm)} ${t(KEY.common_delete)} ${element.message_no}`)) {
                          deleteSelectedEvent(element.id);
                        }
                      }}
                    >
                      {t(KEY.common_delete)}
                    </Button>{' '}
                  </div>
                ),
              },
            ];
          })}
        />
      </div>
    </AdminPageLayout>
  );
}
