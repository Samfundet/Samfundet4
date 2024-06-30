import styles from './RecruitmentStatistics.module.scss';
import { Text } from '~/Components/Text/Text';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { getRecruitmentStats } from '~/api';
import { useParams } from 'react-router-dom';

export function RecruitmentStatistics() {
  const { recruitmentId } = useParams();
  const { t } = useTranslation();
  // TODO: add dynamic data and might need backend features (in ISSUE #1110)

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentStats(recruitmentId);
    }
  }, [recruitmentId]);

  const mockRecruitmentStatOne = [
    { at_date: '28-08-2024', recruitment_applications: 10 },
    { at_date: '25-08-2024', recruitment_applications: 2 },
  ];

  const recruitmentStatisticsContainer = (children: ReactNode, chartTitle: string) => (
    <div className={styles.statisticsContainer}>
      <Text as="strong" size="m">
        {chartTitle}
      </Text>
      <div className={styles.chartContainer}>{children}</div>
    </div>
  );

  const statisticsViews = () => {
    // this will render charts with recruitment data. For now a placeholder. Implement charts w. data in #1110
    return mockRecruitmentStatOne?.map((stat, index) =>
      recruitmentStatisticsContainer(
        <Text key={index}>{`Date: ${stat.at_date}, Applications: ${stat.recruitment_applications}`}</Text>,
        'PLACEHOLDER CHART TITLE',
      ),
    );
  };

  return (
    <div className={styles.container}>
      <Text as={'strong'} size={'xl'}>
        {t(KEY.recruitment_statistics)}
      </Text>
      <div className={styles.subContainer}>{statisticsViews()}</div>
    </div>
  );
}
