import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Chart, SamfundetLogoSpinner } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentForRecruiter } from '~/api';
import type { RecruitmentForRecruiterDto } from '~/dto';
import { useCustomNavigate, useParentElementWidth } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './RecruitmentStatistics.module.scss';

type RecruitmentStatisticsProps = {
  recruitmentId?: string;
};

export function RecruitmentStatistics({ recruitmentId }: RecruitmentStatisticsProps) {
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

  const { data, isLoading, error } = useQuery<RecruitmentForRecruiterDto>({
    queryKey: ['recruitmentStats', recruitmentId],
    queryFn: () => getRecruitmentForRecruiter(recruitmentId as string),
    enabled: typeof recruitmentId === 'string',
  });

  const statistics = data?.statistics;

  return (
    <div className={styles.container}>
      {statistics ? (
        <>
          <Table
            data={[
              { cells: [`${t(KEY.common_total)} ${t(KEY.recruitment_applicants)}`, statistics.total_applicants] },
              { cells: [`${t(KEY.common_total)} ${t(KEY.recruitment_applications)}`, statistics.total_applications] },
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
              data={statistics.time_stats.map((time) => {
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
              data={statistics.date_stats.map((date) => {
                return { value: date.count, label: date.date };
              })}
            />
            <Chart
              type="pie"
              chartTitle={t(KEY.recruitment_stats_campus_header)}
              legend={t(KEY.common_campus)}
              size="small"
              data={statistics.campus_stats.map((campus) => {
                return { value: campus.count, label: campus.campus };
              })}
            />
          </div>
        </>
      ) : (
        <SamfundetLogoSpinner position="center" />
      )}
    </div>
  );
}
