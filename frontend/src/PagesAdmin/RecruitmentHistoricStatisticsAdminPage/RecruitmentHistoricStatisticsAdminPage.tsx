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
import { type CampusApplicantDataset, mock_campus_applicant_data } from './mock-campus-distribution';

const mapApplicantCountData = (data: { number: number; label: string }[]): CartesianChartsData[] => {
  /**
   * #######################################################################
   * TODO:
   * This map will probably have to change to
   * adhere to the final backend solution.
   * There will also probably be raw application count
   * data in backend, where we calculate "safe-to-send" indexed data
   * #######################################################################
   */
  return data.map((dataItem) => ({
    value: dataItem.number,
    label: dataItem.label,
  }));
};

const computeWeightedDistribution = (data: CampusApplicantDataset) => {
  /**
   * ################################################################
   *  TODO:
   *  This computation should probably be done in backend, or we should
   *  store the data in such a way that no computation is needed
   * ################################################################
   */
  return data.map((semesterData) => {
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
      distribution: normalizedDistribution,
    };
  });
};

export function RecruitmentHistoricStatisticsAdminPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.recruitment_overview));

  // ----------------------------------------------------------------------------------------------------------------------------------------
  /**
   *  #####################
   *  TODO:
   *  This will be replaced
   *  with actuall queries
   *  #####################
   *
   */
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
    /* Applicant count state */
    setindexedHistoricUniqueApplicants(mapApplicantCountData(indexed_historic_unique_applicants));
    setIndexedHistoricUniqueApplicantsSpring(mapApplicantCountData(indexed_historic_unique_applicants_v));
    setIndexedHistoricUniqueApplicantsAutumn(mapApplicantCountData(indexed_historic_unique_applicants_h));

    /* Campus distribution state */
    setHistoricCampusDistribution(computeWeightedDistribution(mock_campus_applicant_data));
  }, []);
  // ----------------------------------------------------------------------------------------------------------------------------------------

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
