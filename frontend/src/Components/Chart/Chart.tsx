/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

// toggle remove ts-nocheck when developing. It is here because TS freaks out over the function props.
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
  chartTitle,
  size,
  xAxisLegend,
  yAxisLegend,
  spliceYLabel,
  spliceXLabel,
  yLabelCount,
  hasXDirLines,
  hasYDirLines,
  legend,
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
    pie: <PieChart chartTitle={chartTitle} data={data} size={size} legend={legend} />,
  };

  return chart[type];
}
