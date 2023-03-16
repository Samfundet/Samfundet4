import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { deleteClosedPeriod, getClosedPeriods } from '~/api';
import { Button, Link, SamfundetLogoSpinner } from '~/Components';
import { Page } from '~/Components/Page';
import { AlphabeticTableCell, ITableCell, Table } from '~/Components/Table';
import { ClosedPeriodDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import styles from './ClosedPeriodAdminPage.module.scss';

export function ClosedPeriodAdminPage() {
  const navigate = useNavigate();
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriodDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  function getAllClosedPeriods() {
    setShowSpinner(true);
    getClosedPeriods()
      .then((data) => {
        setClosedPeriods(data);
        setShowSpinner(false);
      })
      .catch(console.error);
  }

  // Stuff to do on first render.
  // TODO add permissions on render

  useEffect(() => {
    getAllClosedPeriods();
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
              // new AlphabeticTableCell(<TimeDisplay displayType="date" timestamp={element.start_dt} />),
              new AlphabeticTableCell(element.start_dt.toLocaleString()),
              // new AlphabeticTableCell(<TimeDisplay displayType="date" timestamp={element.end_dt} />),
              new AlphabeticTableCell(element.end_dt.toLocaleString()),
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
