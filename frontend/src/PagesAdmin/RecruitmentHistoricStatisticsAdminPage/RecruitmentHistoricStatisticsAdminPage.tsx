import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart } from '~/Components';
import type { CartesianChartsData } from '~/Components/Chart/CartesianCharts';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { indexed_historic_unique_applicants } from './mock-recruitment-data';

// type DataItemType = {
//   label: string;
//   number: number;
// };

export function RecruitmentHistoricStatisticsAdminPage() {
  const { t } = useTranslation();

  useTitle(t(KEY.recruitment_overview));

  // Create a properly typed state with an empty array as initial value instead of undefined
  const [chartData, setChartData] = useState<CartesianChartsData[]>([]);

  useEffect(() => {
    // Transform the mock data into the format expected by the Chart component
    const formattedData: CartesianChartsData[] = indexed_historic_unique_applicants.map((dataItem) => ({
      value: dataItem.number,
      label: dataItem.label,
    }));

    setChartData(formattedData);
  }, []);

  return (
    <AdminPageLayout title={'RecruitmentHistoricStatisticsAdminPage is under construction'}>
      <Chart
        type="bar"
        chartTitle={t(KEY.recruitment_stats_hours_header)}
        size="medium"
        yAxisLegend={t(KEY.recruitment_applications)}
        xAxisLegend={t(KEY.common_time)}
        yLabelCount={10}
        data={chartData}
      />
    </AdminPageLayout>
  );
}
