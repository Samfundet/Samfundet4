import { BarChart, PieChart, LineChart } from './Components';

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
  maxBarWidth?: number;
  minBarWidth?: number;
};

export function Chart({
  chartType,
  data,
  chartTitle,
  labelSpliceStart,
  labelSpliceEnd,
  vAxisLabel,
  hAxisLabel,
  maxBarWidth,
  minBarWidth,
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
          maxBarWidth={maxBarWidth}
          minBarWidth={minBarWidth}
        />
      );
    case 'line':
      return <LineChart data={data} svgHeight={400} vAxisSpace={5} scale={20} barWidth={40} barSpacing={10} />;
  }
}
