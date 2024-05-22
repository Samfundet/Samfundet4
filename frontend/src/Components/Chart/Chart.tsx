/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

// toggle remove ts-nocheck when developing. It is here because TS freaks out over the function props.
import { BarChart, LineChart, CartesianChartProps } from './CartesianCharts';
import { CircularChartProps, PieChart } from './CircularCharts';

// correct typing for each category of chart.
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

/**
 * @param type 👉 chart type.
 * @param data 👉 displayed in the chart.
 * @param chartTitle 👉 title of the chart.
 * @param size 👉 the visual (style) size of the chart.
 * @param xAxisLegend 👉 cartesian charts only. X-axis description, should contain a word description and unit (+ unit magnitude if relevant).
 * @param yAxisLegend 👉 cartesian only. Y-axis description, should contain a word description and unit. (+ unit magnitude if relevant).
 * @param splitYLabel 👉 cartesian only. Allows for splitting the y-axis label. Usually a number value, but can be split. Nice if large number. E.g. '1000000', can be split to '1'.
 * @param spliceXLabel 👉 cartesian only. Allows for splitting the x-axis label.Used if the label is long e.g. '24. december', could be split to '24. dec'
 * @param yLabelCount 👉 cartesian only. Controls amount of labels on the y-axis.
 * @param hasXDirLines 👉 cartesian only. Controls weather the chart has horizontal lines.
 * @param hasYDirLines 👉 cartesian only. Controls weather the chart has vertical lines.
 * @param legend 👉 circle only. description of chart data.
 * */
export function Chart({
  type,
  data,
  chartTitle,
  size,
  xAxisLegend,
  yAxisLegend,
  splitYLabel,
  splitXLabel,
  yLabelCount,
  hasXDirLines,
  hasYDirLines,
  legend,
}: ChartProps) {
  // Object containing chart components.
  const chart = {
    bar: (
      <BarChart
        chartTitle={chartTitle}
        data={data}
        size={size}
        xAxisLegend={xAxisLegend}
        yAxisLegend={yAxisLegend}
        yLabelCount={yLabelCount}
        splitYLabel={splitYLabel}
        splitXLabel={splitXLabel}
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
        splitYLabel={splitYLabel}
        splitXLabel={splitXLabel}
        hasXDirLines={hasXDirLines}
        hasYDirLines={hasYDirLines}
      />
    ),
    pie: <PieChart chartTitle={chartTitle} data={data} size={size} legend={legend} />,
  };

  return chart[type];
}
