import styles from './RecruitmentStatistics.module.scss';
import { Text } from '~/Components/Text/Text';
import { ReactNode, useEffect, useState } from 'react';

export function RecruitmentStatistics() {
  const [mockRecruitmentStatOne, setMockRecruitmentStatOne] = useState([
    { at_date: '28-08-2024', recruitment_applications: 10 },
    { at_date: '25-08-2024', recruitment_applications: 2 },
  ]);

  useEffect(() => {
    // Simulating fetching data
    // TODO: add API call and backend
    // This mock data does not represent real data, just a placeholder
    setMockRecruitmentStatOne([
      {
        at_date: '28-08-2024---PLACEHOLDER',
        recruitment_applications: 10,
      },
      {
        at_date: '25-08-2024 ---- PLACEHOLDER',
        recruitment_applications: 2,
      },
    ]);
  }, []);

  const recruitmentStatisticsContainer = (children: ReactNode, chartTitle: string) => (
    <div className={styles.statisticsContainer}>
      <Text as={'strong'} size={'m'}>
        {chartTitle}
      </Text>
      <div className={styles.chartContainer}>{children}</div>
    </div>
  );

  const statisticsViews = () => {
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
        RecruitmentStatistics
      </Text>
      <div className={styles.subContainer}>{statisticsViews()}</div>
    </div>
  );
}
