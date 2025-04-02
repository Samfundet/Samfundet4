import { Chart, H4 } from '~/Components';
import type { CircularChartData } from '~/Components/Chart/CircularCharts';
import styles from './CampusDistributionCharts.module.scss';

type CampusDistributionChartsProps = {
  historicCampusDistribution: Array<{ semester: string; distribution: CircularChartData[] }>;
};

export function CampusDistributionCharts({ historicCampusDistribution }: CampusDistributionChartsProps) {
  if (historicCampusDistribution.length === 0) {
    return <div className={styles.charts_group}>Loading campus distribution data...</div>;
  }

  return (
    <>
      <H4>These boxes contain the exact same data so that you can scroll to compare semesters.</H4>
      <div className={styles.charts_container}>
        <div className={styles.charts_group}>
          {historicCampusDistribution.map((data) => (
            <div key={data.semester} className={styles.chart_wrapper}>
              <Chart
                type="pie"
                chartTitle={`${data.semester}`}
                size="small"
                data={data.distribution}
                legend="Weighted by campus population"
              />
            </div>
          ))}
        </div>
        <div className={styles.charts_group}>
          {historicCampusDistribution.map((data) => (
            <div key={data.semester} className={styles.chart_wrapper}>
              <Chart
                type="pie"
                chartTitle={`${data.semester}`}
                size="small"
                data={data.distribution}
                legend="Weighted by campus population"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
