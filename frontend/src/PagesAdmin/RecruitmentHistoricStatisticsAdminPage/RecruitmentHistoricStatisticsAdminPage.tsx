import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { H1, type Tab, TabView } from '~/Components';
import type { CartesianChartsData } from '~/Components/Chart/CartesianCharts';
import type { CircularChartData } from '~/Components/Chart/CircularCharts';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ApplicantCountCharts } from './ApplicantCountCharts/ApplicantCountCharts';
import { CampusDistributionCharts } from './CampusDistributionCharts/CampusDistributionCharts';
import styles from './RecruitmentHistoricStatisticsAdminPage.module.scss';
import {
  indexed_historic_unique_applicants,
  indexed_historic_unique_applicants_h,
  indexed_historic_unique_applicants_v,
} from './mock-applicant-count';
import { mock_campus_applicant_data } from './mock-campus-distribution';

export function RecruitmentHistoricStatisticsAdminPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.recruitment_overview));

  /* Applicant count data state */
  const [indexedHistoricUniqueApplicants, setindexedHistoricUniqueApplicants] = useState<CartesianChartsData[]>([]);
  const [indexedHistoricUniqueApplicantsSpring, setIndexedHistoricUniqueApplicantsSpring] = useState<
    CartesianChartsData[]
  >([]);
  const [indexedHistoricUniqueApplicantsAutumn, setIndexedHistoricUniqueApplicantsAutumn] = useState<
    CartesianChartsData[]
  >([]);

  /* Campus distribution data state */
  const [historicCampusDistribution, setHistoricCampusDistribution] = useState<
    Array<{ semester: string; distribution: CircularChartData[] }>
  >([]);

  useEffect(() => {
    /* Transform applicant count data */
    const formattedData: CartesianChartsData[] = indexed_historic_unique_applicants.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    const formattedSpringData: CartesianChartsData[] = indexed_historic_unique_applicants_v.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    const formattedAutumnData: CartesianChartsData[] = indexed_historic_unique_applicants_h.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    setindexedHistoricUniqueApplicants(formattedData);
    setIndexedHistoricUniqueApplicantsSpring(formattedSpringData);
    setIndexedHistoricUniqueApplicantsAutumn(formattedAutumnData);

    /* Calculate weighted campus distribution data */
    const weightedDistribution = computeWeightedDistribution();

    // Sort by semester (ascending order)
    weightedDistribution.sort((a, b) => a.semester.localeCompare(b.semester));

    // Format data for the CampusDistributionCharts component
    const formattedDistribution = weightedDistribution.map((item) => ({
      semester: item.semester,
      distribution: item.campus_distribution,
    }));

    // Set the data for campus distribution charts
    setHistoricCampusDistribution(formattedDistribution);
  }, []);

  const computeWeightedDistribution = () => {
    return mock_campus_applicant_data.map((semesterData) => {
      // Calculate the raw weighted values for each campus
      const rawWeightedValues = semesterData.campus_applicant_data.map((campus) => ({
        label: campus.label,
        weightedValue: campus.applicants / campus.student_campus_count,
      }));

      // Calculate the total of all weighted values
      const totalWeightedValue = rawWeightedValues.reduce((sum, campus) => sum + campus.weightedValue, 0);

      // Normalize values to percentages (adding up to 100%)
      const normalizedDistribution: CircularChartData[] = rawWeightedValues.map((campus) => ({
        label: campus.label,
        value: Number(((campus.weightedValue / totalWeightedValue) * 100).toFixed(2)),
      }));

      // Return object with semester and normalized campus distribution
      return {
        semester: semesterData.semester,
        campus_distribution: normalizedDistribution,
      };
    });
  };

  const tabs: Tab<ReactNode>[] = useMemo(() => {
    return [
      {
        key: 1,
        label: 'Indexed historic applicant count',
        value: (
          <ApplicantCountCharts
            indexedHistoricUniqueApplicants={indexedHistoricUniqueApplicants}
            indexedHistoricUniqueApplicantsSpring={indexedHistoricUniqueApplicantsSpring}
            indexedHistoricUniqueApplicantsAutumn={indexedHistoricUniqueApplicantsAutumn}
          />
        ),
      },
      {
        key: 2,
        label: 'Weighted historic campus distribution',
        value: <CampusDistributionCharts historicCampusDistribution={historicCampusDistribution} />,
      },
    ];
  }, [
    indexedHistoricUniqueApplicants,
    indexedHistoricUniqueApplicantsSpring,
    indexedHistoricUniqueApplicantsAutumn,
    historicCampusDistribution,
  ]);

  return (
    <AdminPageLayout title={'Historic recruitment data'}>
      <H1 className={styles.under_construction}>This page is under construction, it is displaying mock data!</H1>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
