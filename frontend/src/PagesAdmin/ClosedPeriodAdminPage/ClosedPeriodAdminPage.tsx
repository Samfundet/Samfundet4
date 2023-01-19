import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EventQuery, Link, SamfundetLogoSpinner, TimeDisplay } from '~/Components';
import { Page } from '~/Components/Page';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './ClosedPeriodAdminPage.module.scss';
import { ClosedPeriodDto } from '~/dto';
import { deleteClosedPeriod, getClosedPeriods } from '~/api';
import { Table, AlphabeticTableCell, ITableCell } from '~/Components/Table';
import { reverse } from '~/named-urls';

export function ClosedPeriodAdminPage() {
  const navigate = useNavigate();
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriodDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  function getAllClosedPeriods() {
    getClosedPeriods()
      .then((data) => {
        setClosedPeriods(data);
      })
      .catch(console.error);
  }

  // Stuff to do on first render.
  // TODO add permissions on render

  useEffect(() => {
    getAllClosedPeriods();
    setShowSpinner(false);
  }, []);

  function deleteSelectedEvent(id: number) {
    deleteClosedPeriod(id).then(() => {
      getAllClosedPeriods();
    });
  }

  if (showSpinner) {
    return (
      <div className={styles.spinner}>
        <SamfundetLogoSpinner />
      </div>
    );
  }

  return (
    <Page>
      <Button theme="outlined" onClick={() => navigate(ROUTES.frontend.admin)} className={styles.backButton}>
        <p className={styles.backButtonText}>{t(KEY.back)}</p>
      </Button>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t(KEY.admin_closed_period_title)}</h1>
        <Link target="backend" url={ROUTES.backend.admin__samfundet_closedperiod_changelist}>
          View in backend
        </Link>
      </div>
      <Button theme="success" onClick={() => navigate(ROUTES.frontend.admin_closed_create)}>
        {t(KEY.admin_closed_period_new_period)}
      </Button>
      <div className={styles.tableContainer}>
        <Table
          columns={[t(KEY.common_message), 'Event ' + t(KEY.common_message), t(KEY.start_time), t(KEY.end_time), '']}
          data={closedPeriods.map(function (element) {
            return [
              new AlphabeticTableCell(element.message_no),
              new AlphabeticTableCell(element.description_no),
              new AlphabeticTableCell(<TimeDisplay displayType="date" timestamp={element.start_dt} />),
              new AlphabeticTableCell(<TimeDisplay displayType="date" timestamp={element.end_dt} />),
              {
                children: (
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
                      {t(KEY.edit)}
                    </Button>
                    <Button
                      theme="samf"
                      display="block"
                      className={styles.smallButtons}
                      onClick={() => {
                        if (window.confirm(`${t(KEY.form_confirm)} ${t(KEY.delete)} ${element.message_no}`)) {
                          deleteSelectedEvent(element.id);
                        }
                      }}
                    >
                      {t(KEY.delete)}
                    </Button>{' '}
                  </div>
                ),
              } as ITableCell,
            ];
          })}
        />
      </div>
    </Page>
  );
}
