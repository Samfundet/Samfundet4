import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link, ProgressBar, SamfundetLogoSpinner } from '~/Components';
import { Table, type TableRow } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentStats } from '~/api';
import { GangStatsDto, type RecruitmentForRecruiterDto, type RecruitmentGangStatDto, RecruitmentStatsDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, toPercentage } from '~/utils';
import styles from './RecruitmentProgression.module.scss';

type RecruitmentProgessionProps = {
  recruitment: RecruitmentForRecruiterDto | undefined;
};

export function RecruitmentProgression({ recruitment }: RecruitmentProgessionProps) {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();
  const navigate = useCustomNavigate();
  const ONE_HUNDRED_PERCENT = 1;

  const tableColumns = [
    { content: t(KEY.common_gang), sortable: true },
    { content: t(KEY.recruitment_applications), sortable: true },
    { content: t(KEY.common_processed), sortable: true },
    { content: t(KEY.recruitment_admitted), sortable: true },
    { content: t(KEY.recruitment_rejected), sortable: true },
  ];

  function gangStatToRow(gangStat: RecruitmentGangStatDto) {
    return {
      cells: [
        {
          value: dbT(gangStat.gang, 'name'),
          content: (
            <Link
              url={reverse({
                pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
                urlParams: {
                  recruitmentId: recruitmentId,
                  gangId: gangStat.gang.id,
                },
              })}
            >
              {dbT(gangStat.gang, 'name')}
            </Link>
          ),
        },
        {
          value: gangStat.application_count,
        },
        {
          value: gangStat.total_accepted + gangStat.total_rejected,
        },
        {
          value: gangStat.total_accepted,
        },
        {
          value: gangStat.total_rejected,
        },
      ],
    };
  }
  return (
    <div className={styles.container}>
      <Text as={'strong'} size={'xl'}>
        {t(KEY.recruitment_progression)}
        {recruitment?.name_en}
      </Text>
      {recruitment ? (
        <>
          <div className={styles.progressBarContainer}>
            <span>{toPercentage(recruitment.recruitment_progress)}</span>
            <ProgressBar max={1} value={recruitment.recruitment_progress} className={styles.progressBar} />
          </div>

          <div className={styles.gridWrapper}>
            <div className={styles.progressReport}>
              <Text as={'p'} size={'l'}>
                {recruitment.total_processed_applicants}/{recruitment.total_applicants}{' '}
                {t(KEY.recruitment_applicants_processed)}.
              </Text>
              <Text as={'p'} size={'l'}>
                {recruitment.total_processed_applications}/{recruitment.statistics.total_applications}{' '}
                {t(KEY.recruitment_applications_processed)}.
              </Text>
              <Text as={'p'} size={'m'}>
                <ul>
                  <li>
                    {recruitment.statistics.total_accepted} {t(KEY.recruitment_applicants)} {t(KEY.common_will)}{' '}
                    {t(KEY.common_get)} {t(KEY.recruitment_position)}
                  </li>
                  <li>
                    {recruitment.statistics.total_rejected} {t(KEY.recruitment_applicants)} {t(KEY.common_will)}{' '}
                    {t(KEY.common_be)} {t(KEY.common_rejected)}
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
                ADD COUNT {t(KEY.recruitment_applicants)} {t(KEY.common_have)} {t(KEY.common_received)}{' '}
                {t(KEY.recruitment_rejection_email)}
              </Text>
              {recruitment.recruitment_progress < ONE_HUNDRED_PERCENT ? (
                <Text size={'m'} as={'strong'}>
                  {t(KEY.common_create)} {t(KEY.recruitment_rejection_email)}: {t(KEY.common_it)} {t(KEY.common_is)}{' '}
                  {t(KEY.common_possible)} {t(KEY.common_when)} {t(KEY.common_all)} {t(KEY.recruitment_applications)}{' '}
                  {t(KEY.common_have)} {t(KEY.common_been)} {t(KEY.common_processed)}. {t(KEY.common_come_back_later)}!
                </Text>
              ) : (
                <Button
                  theme={'green'}
                  onClick={() => {
                    navigate({
                      url: reverse({
                        pattern: ROUTES.frontend.admin_recruitment_gang_overview_rejection_email,
                        urlParams: { recruitmentId: recruitmentId },
                      }),
                    });
                  }}
                >
                  {`${t(KEY.common_create)} ${t(KEY.recruitment_rejection_email)}`}
                </Button>
              )}
            </div>
          </div>
          <hr className={styles.lineDivider} />
          <div className={styles.tableContainer}>
            <Table
              columns={tableColumns}
              data={recruitment.statistics.gang_stats.map((gangStat) => gangStatToRow(gangStat))}
            />
          </div>
        </>
      ) : (
        <SamfundetLogoSpinner position="center" />
      )}
    </div>
  );
}

/**
 * 
  const mock_fetched_data = [
    { team: 'Markedsføringsgjenge', applications: 20, processed: 19, admitted: 9, rejected: 10 },
    { team: 'Kafe og Serveringsgjenge', applications: 30, processed: 30, admitted: 15, rejected: 15 },
  ];

  const mock_rejection_email_count = 0; // number of rejection emails sent.

  useEffect(() => {
    if (!recruitmentId) {
      return;
    }
    if (!mock_fetched_data || mock_rejection_email_count) {
      //TODO: add dynamic data and might need backend features (in ISSUE #1110)
      return;
    }
    //TODO: get calculated data from backend (in ISSUE #1110)
    const totalApps = mock_fetched_data.reduce((sum, current) => sum + current.applications, 0);
    const totalProcessed = mock_fetched_data.reduce((sum, current) => sum + current.processed, 0);
    const totalAdmitted = mock_fetched_data.reduce((sum, current) => sum + current.admitted, 0);
    const totalRejected = mock_fetched_data.reduce((sum, current) => sum + current.rejected, 0);

    getRecruitmentStats(recruitmentId).then(
      recruitmentStats => {
        setTotalApplications(recruitmentStats.total_applications);
        // Where to retrieve number of processed, admitted, rejected?
      }
    );



    setTotalApplications(totalApps);
    setProcessedApplications(totalProcessed);
    setAdmittedCount(totalAdmitted);
    setRejectionCount(totalRejected);

    setRejectionEmailCount(mock_rejection_email_count); // number of rejection emails sent.

    setTableRows();
  }, [processedApplication, totalApplications]);

  const setTableRows = () => {
    const rows: TableRow[] = mock_fetched_data.map((item) => ({
      cells: [
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
      ],
    }));
    setTableRowsState(rows);
  };

 * 

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
 */
