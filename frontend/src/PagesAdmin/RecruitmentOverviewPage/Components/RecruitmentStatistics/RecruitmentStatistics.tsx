import styles from './RecruitmentStatistics.module.scss';
import { Text } from '~/Components/Text/Text';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

export function RecruitmentStatistics() {
  const { t } = useTranslation();
  const [mockRecruitmentStatOne, setMockRecruitmentStatOne] = useState([
    { at_date: '28-08-2024', recruitment_applications: 10 },
    { at_date: '25-08-2024', recruitment_applications: 2 },
  ]);

  useEffect(() => {
    //TODO: add dynamic data and might need backend features (in ISSUE #1110)
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
