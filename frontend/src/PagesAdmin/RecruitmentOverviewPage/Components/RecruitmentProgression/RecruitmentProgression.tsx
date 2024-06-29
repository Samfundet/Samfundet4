import styles from './RecruitmentProgression.module.scss';
import { Text } from '~/Components/Text/Text';
import { useEffect, useState } from 'react';
import { ProgressBar, Button } from '~/Components';
import { Table, TableRow } from '~/Components/Table';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { toPercentage } from '~/utils';

export function RecruitmentProgression() {
  const { t } = useTranslation();
  const [progression, setProgression] = useState<number>(-1);
  const [processedApplication, setProcessesApplications] = useState<number>(-1);
  const [totalApplications, setTotalApplications] = useState<number>(-1);
  const [rejectionCount, setRejectionCount] = useState<number>(-1);
  const [admittedCount, setAdmittedCount] = useState<number>(-1);
  const [rejectionEmailCount, setRejectionEmailCount] = useState<number>(-1);
  const [tableRows, setTableRowsState] = useState<TableRow[]>([]);
  const ONE_HUNDRED_PERCENT = 1;

  const mock_fetched_data = [
    { team: 'Markedsføringsgjenge', applications: 20, processed: 19, admitted: 9, rejected: 10 },
    { team: 'Kafe og Serveringsgjenge', applications: 30, processed: 30, admitted: 15, rejected: 15 },
  ];

  const mock_rejection_email_count = 0; // number of rejection emails sent.

  useEffect(() => {
    if (!mock_fetched_data || mock_rejection_email_count) {
      //TODO: add dynamic data and might need backend features (in ISSUE #1110)
      return;
    }
    //TODO: get calculated data from backend (in ISSUE #1110)
    const totalApps = mock_fetched_data.reduce((sum, current) => sum + current.applications, 0);
    const totalProcessed = mock_fetched_data.reduce((sum, current) => sum + current.processed, 0);
    const totalAdmitted = mock_fetched_data.reduce((sum, current) => sum + current.admitted, 0);
    const totalRejected = mock_fetched_data.reduce((sum, current) => sum + current.rejected, 0);

    setTotalApplications(totalApps);
    setProcessesApplications(totalProcessed);
    setAdmittedCount(totalAdmitted);
    setRejectionCount(totalRejected);

    setRejectionEmailCount(mock_rejection_email_count); // number of rejection emails sent.

    if (totalApplications > 0 && processedApplication >= 0) {
      setProgression(processedApplication / totalApplications);
    } else {
      setProgression(-1);
    }

    setTableRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedApplication, totalApplications]);

  const setTableRows = () => {
    const rows: TableRow[] = mock_fetched_data.map((item) => [
      {
        content: (
          <Button theme={'samf'} className={styles.gangButton} onClick={() => alert('navigate to gjengopptak')}>
            {item.team}
          </Button>
        ),
        value: item.team,
      },
      item.applications,
      item.processed,
      item.admitted,
      item.rejected,
    ]);
    setTableRowsState(rows);
  };

  return (
    <div className={styles.container}>
      <Text as={'strong'} size={'xl'}>
        {t(KEY.recruitment_progression)}
      </Text>
      <div className={styles.progressBarContainer}>
        <span>{toPercentage(progression)}</span>
        <ProgressBar max={1} value={progression} className={styles.progressBar} />
      </div>
      <div className={styles.gridWrapper}>
        <div className={styles.progressReport}>
          <Text as={'p'} size={'l'}>
            {t(KEY.common_total)} {processedApplication} {t(KEY.recruitment_applications_processed)}.
          </Text>
          <Text as={'p'} size={'m'}>
            <ul>
              <li>
                {admittedCount} {t(KEY.recruitment_applicants)} {t(KEY.common_will)} {t(KEY.common_get)}{' '}
                {t(KEY.recruitment_position)}
              </li>
              <li>
                {rejectionCount} {t(KEY.recruitment_applicants)} {t(KEY.common_will)} {t(KEY.common_be)}{' '}
                {t(KEY.common_rejected)}
              </li>
            </ul>
          </Text>
        </div>
        <hr className={styles.lineDivider} />
        <div className={styles.avslagsepostContainer}>
          <Text size={'l'} as={'strong'}>
            {t(KEY.recruitment_automatic_rejection)}
          </Text>
          <Text size={'m'} as={'p'}>
            {rejectionEmailCount} {t(KEY.recruitment_applicants)} {t(KEY.common_have)} {t(KEY.common_received)}{' '}
            {t(KEY.recruitment_rejection_email)}
          </Text>
          {progression < ONE_HUNDRED_PERCENT ? (
            <Text size={'m'} as={'strong'}>
              {t(KEY.common_create)} {t(KEY.recruitment_rejection_email)}: {t(KEY.common_it)} {t(KEY.common_is)}{' '}
              {t(KEY.common_possible)} {t(KEY.common_when)} {t(KEY.common_all)} {t(KEY.recruitment_applications)}{' '}
              {t(KEY.common_have)} {t(KEY.common_been)} {t(KEY.common_processed)}. {t(KEY.common_come_back_later)}!
            </Text>
          ) : (
            <Button
              theme={'green'}
              onClick={() => {
                alert('Skal navigere til siden hvor man lager avslagsepost');
              }}
            >
              {t(KEY.common_create) + ' ' + t(KEY.recruitment_rejection_email)}
              {/*TODO: IN ISSUE #1110, navigate to "create e-mail page"*/}
            </Button>
          )}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={[
            t(KEY.common_gang),
            t(KEY.recruitment_applications),
            t(KEY.common_processed),
            t(KEY.recruitment_admitted),
            t(KEY.recruitment_automatic_rejection),
          ]}
          data={tableRows}
        />
      </div>
    </div>
  );
}
