import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentStats } from '~/api';
import type { RecruitmentStatsDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './RecruitmentStatistics.module.scss';

export function RecruitmentStatistics() {
  const { recruitmentId } = useParams();
  const [stats, setStats] = useState<RecruitmentStatsDto>();
  const { t } = useTranslation();
  // TODO: add dynamic data and might need backend features (in ISSUE #1110)

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentStats(recruitmentId)
        .then((response) => {
          setStats(response.data);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }, [recruitmentId, t]);

  return (
    <div className={styles.container}>
      <Text as={'strong'} size={'xl'}>
        {t(KEY.recruitment_statistics)}
      </Text>
      {stats && (
        <>
          <Table
            data={[
              [`${t(KEY.common_total)} ${t(KEY.recruitment_applicants)}`, stats.total_applicants],
              [`${t(KEY.common_total)} ${t(KEY.recruitment_applications)}`, stats.total_applications],
            ]}
          />
          <div className={styles.subContainer}>
            <Chart
              type="bar"
              chartTitle={t(KEY.recruitment_stats_hours_header)}
              size="medium"
              yAxisLegend={t(KEY.recruitment_applications)}
              xAxisLegend={t(KEY.common_time)}
              yLabelCount={10}
              data={stats.time_stats.map((time) => {
                return { value: time.count, label: time.hour.toString() };
              })}
            />
            <Chart
              type="line"
              chartTitle={t(KEY.recruitment_stats_date_header)}
              size="large"
              yAxisLegend={t(KEY.recruitment_applications)}
              xAxisLegend={t(KEY.common_date)}
              yLabelCount={10}
              data={stats.date_stats.map((date) => {
                return { value: date.count, label: date.date };
              })}
            />
            <Chart
              type="pie"
              chartTitle={t(KEY.recruitment_stats_campus_header)}
              legend={t(KEY.common_campus)}
              size="small"
              data={stats.campus_stats.map((campus) => {
                return { value: campus.count, label: campus.campus };
              })}
            />
          </div>
        </>
      )}
    </div>
  );
}
