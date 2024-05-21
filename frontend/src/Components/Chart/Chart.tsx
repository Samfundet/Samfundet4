/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BarChart, LineChart, CartesianChartProps } from './CartesianCharts';
import { CircularChartProps, PieChart } from './CircularCharts';

type ChartProps =
  | ({
      type: 'bar';
    } & CartesianChartProps)
  | ({
      type: 'line';
    } & CartesianChartProps)
  | ({
      type: 'pie';
    } & CircularChartProps);

export function Chart({
  type,
  data,
  chartTitle, // @ts-ignore
  size, // @ts-ignore
  hAxisLegend, // @ts-ignore
  vAxisLegend, // @ts-ignore
  spliceVLabel, // @ts-ignore
  spliceHLabel, // @ts-ignore
  hLabelCount,
}: ChartProps) {
  const chart = {
    bar: (
      <BarChart
        chartTitle={chartTitle}
        data={data}
        size={size}
        hAxisLegend={hAxisLegend}
        vAxisLegend={vAxisLegend}
        hLabelCount={hLabelCount}
        spliceVLabel={spliceVLabel}
        spliceHLabel={spliceHLabel}
      />
    ),
    line: (
      <LineChart
        chartTitle={chartTitle}
        data={data}
        size={size}
        hAxisLegend={hAxisLegend}
        vAxisLegend={vAxisLegend}
        hLabelCount={hLabelCount}
        spliceVLabel={spliceVLabel}
        spliceHLabel={spliceHLabel}
      />
    ),
    pie: <PieChart chartTitle={chartTitle} data={data} />,
  };

  return chart[type];
}
