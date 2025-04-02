import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { H1, type Tab, TabView } from '~/Components';
import type { CartesianChartsData } from '~/Components/Chart/CartesianCharts';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ApplicantCountCharts } from './ApplicantCountCharts/ApplicantCountCharts';
import styles from './RecruitmentHistoricStatisticsAdminPage.module.scss';
import {
  indexed_historic_unique_applicants,
  indexed_historic_unique_applicants_h as indexed_historic_unique_applicants_autumn,
  indexed_historic_unique_applicants_v as indexed_historic_unique_applicants_spring,
} from './mock-recruitment-data';

export function RecruitmentHistoricStatisticsAdminPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.recruitment_overview));

  // Create a properly typed state with an empty array as initial value
  const [indexedHistoricUniqueApplicants, setindexedHistoricUniqueApplicants] = useState<CartesianChartsData[]>([]);
  const [indexedHistoricUniqueApplicantsSpring, setIndexedHistoricUniqueApplicantsSpring] = useState<
    CartesianChartsData[]
  >([]);

  const [indexedHistoricUniqueApplicantsAutumn, setIndexedHistoricUniqueApplicantsAutumn] = useState<
    CartesianChartsData[]
  >([]);

  useEffect(() => {
    // Transform the mock data into the format expected by the Chart component
    const formattedData: CartesianChartsData[] = indexed_historic_unique_applicants.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    // Transform spring data (v)
    const formattedSpringData: CartesianChartsData[] = indexed_historic_unique_applicants_spring.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    // Transform autumn data (h)
    const formattedAutumnData: CartesianChartsData[] = indexed_historic_unique_applicants_autumn.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    setindexedHistoricUniqueApplicants(formattedData);
    setIndexedHistoricUniqueApplicantsSpring(formattedSpringData);
    setIndexedHistoricUniqueApplicantsAutumn(formattedAutumnData);
  }, []);

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
      { key: 2, label: 'Weighted historic campus distribution ', value: <H1>TEST-2</H1> },
    ];
  }, [indexedHistoricUniqueApplicants, indexedHistoricUniqueApplicantsSpring, indexedHistoricUniqueApplicantsAutumn]);

  return (
    <AdminPageLayout title={'Historic recruitment data'}>
      <H1 className={styles.under_construction}>This page is under construction</H1>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
