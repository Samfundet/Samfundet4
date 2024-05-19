import { PieChart } from './Components';
import { BarChart } from './Components';

export type ChartData = {
  label: string;
  value: number;
};

type ChartProps = {
  chartType: 'pie' | 'bar' | 'line';
  chartTitle: string;
  data: ChartData[];
  labelSpliceStart?: number;
  labelSpliceEnd?: number;
  vAxisLabel?: string;
  hAxisLabel?: string;
};

export function Chart({
  chartType,
  data,
  chartTitle,
  labelSpliceStart,
  labelSpliceEnd,
  vAxisLabel,
  hAxisLabel,
}: ChartProps) {
  switch (chartType) {
    case 'pie':
      return <PieChart data={data} charTitle={chartTitle} />;
    case 'bar':
      return (
        <BarChart
          data={data}
          chartTitle={chartTitle}
          labelSpliceStart={labelSpliceStart}
          labelSpliceEnd={labelSpliceEnd}
          hAxisLabel={hAxisLabel}
          vAxisLabel={vAxisLabel}
        />
      );
  }
}
