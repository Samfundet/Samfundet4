import { Chart, H2 } from '~/Components';
import type { CartesianChartsData } from '~/Components/Chart/CartesianCharts/utils/types';
import styles from './ApplicantCountCharts.module.scss';

type ApplicantCountChartsProps = {
  indexedHistoricUniqueApplicants: CartesianChartsData[];
  indexedHistoricUniqueApplicantsSpring: CartesianChartsData[];
  indexedHistoricUniqueApplicantsAutumn: CartesianChartsData[];
};

export function ApplicantCountCharts({
  indexedHistoricUniqueApplicants,
  indexedHistoricUniqueApplicantsSpring,
  indexedHistoricUniqueApplicantsAutumn,
}: ApplicantCountChartsProps) {
  return (
    <div className={styles.charts_group}>
      <div className={styles.chart_wrapper}>
        <Chart
          type="bar"
          chartTitle={'Spring/Autumn'}
          size="xlarge"
          yAxisLegend={'Applicants'}
          xAxisLegend={'Year'}
          yLabelCount={10}
          data={indexedHistoricUniqueApplicants}
        />
      </div>
      <div className={styles.chart_wrapper}>
        <H2>Spring Semester Applicants</H2>
        <Chart
          type="bar"
          chartTitle={'Spring'}
          size="xlarge"
          yAxisLegend={'Applicants'}
          xAxisLegend={'Semester'}
          yLabelCount={10}
          data={indexedHistoricUniqueApplicantsSpring}
        />
      </div>

      <div className={styles.chart_wrapper}>
        <H2>Autumn Semester Applicants</H2>
        <Chart
          type="bar"
          chartTitle={'Autumn'}
          size="xlarge"
          yAxisLegend={'Applicants'}
          xAxisLegend={'Semester'}
          yLabelCount={10}
          data={indexedHistoricUniqueApplicantsAutumn}
        />
      </div>
    </div>
  );
}
