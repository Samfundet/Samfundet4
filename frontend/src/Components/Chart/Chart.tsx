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
  xAxisLegend, // @ts-ignore
  yAxisLegend, // @ts-ignore
  spliceYLabel, // @ts-ignore
  spliceXLabel, // @ts-ignore
  yLabelCount, // @ts-ignore
  hasXDirLines, // @ts-ignore
  hasYDirLines,
}: ChartProps) {
  const chart = {
    bar: (
      <BarChart
        chartTitle={chartTitle}
        data={data}
        size={size}
        xAxisLegend={xAxisLegend}
        yAxisLegend={yAxisLegend}
        yLabelCount={yLabelCount}
        spliceYLabel={spliceYLabel}
        spliceXLabel={spliceXLabel}
        hasXDirLines={hasXDirLines}
        hasYDirLines={hasYDirLines}
      />
    ),
    line: (
      <LineChart
        chartTitle={chartTitle}
        data={data}
        size={size}
        xAxisLegend={xAxisLegend}
        yAxisLegend={yAxisLegend}
        yLabelCount={yLabelCount}
        spliceYLabel={spliceYLabel}
        spliceXLabel={spliceXLabel}
        hasXDirLines={hasXDirLines}
        hasYDirLines={hasYDirLines}
      />
    ),
    pie: <PieChart chartTitle={chartTitle} data={data} />,
  };

  return chart[type];
}
