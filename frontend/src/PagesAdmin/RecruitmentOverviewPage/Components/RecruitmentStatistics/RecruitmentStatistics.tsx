import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart, SamfundetLogoSpinner } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentStats } from '~/api';
import type { RecruitmentStatsDto } from '~/dto';
import { useCustomNavigate, useParentElementWidth } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './RecruitmentStatistics.module.scss';

export function RecruitmentStatistics() {
  const { recruitmentId } = useParams();
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartContainerWidth = useParentElementWidth(chartRef);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const div = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  if (typeof recruitmentId !== 'string') {
    navigate({ url: ROUTES.frontend.admin_recruitment });
    toast.error(t(KEY.common_something_went_wrong));
  }

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<RecruitmentStatsDto>({
    queryKey: ['recruitmentStats', recruitmentId],
    queryFn: () => getRecruitmentStats(recruitmentId as string),
    enabled: typeof recruitmentId === 'string',
  });

  if (isLoading) {
    return <SamfundetLogoSpinner position="center" />;
  }

  if (error) {
    toast.error(t(KEY.common_something_went_wrong));
  }

  return (
    <div className={styles.container}>
      <Text as={'strong'} size={'xl'}>
        {t(KEY.recruitment_statistics)}
      </Text>
      {stats && (
        <>
          <Table
            data={[
              { cells: [`${t(KEY.common_total)} ${t(KEY.recruitment_applicants)}`, stats.total_applicants] },
              { cells: [`${t(KEY.common_total)} ${t(KEY.recruitment_applications)}`, stats.total_applications] },
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
      {stats && (
        <>
          <Table
            data={[
              { cells: [`${t(KEY.common_total)} ${t(KEY.recruitment_applicants)}`, stats.total_applicants] },
              { cells: [`${t(KEY.common_total)} ${t(KEY.recruitment_applications)}`, stats.total_applications] },
            ]}
          />
          <div className={styles.subContainer} ref={div}>
            <div
              style={{
                transform: `scaleX(${(width ?? 520) / 520})`,
              }}
              ref={chartRef}
            >
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
            </div>
            <div
              style={{
                transform: `scaleX(${(width ?? 670) / 670})`,
              }}
            >
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
            </div>
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
