import { PieChart } from './Components';

export type ChartData = {
  label: string;
  value: number;
};

type ChartProps = {
  chartType: 'pie' | 'bar' | 'line';
  chartTitle: string;
  data: ChartData[];
};

export function Chart({ chartType, data, chartTitle }: ChartProps) {
  switch (chartType) {
    case 'pie':
      return <PieChart data={data} charTitle={chartTitle} />;
  }
}
