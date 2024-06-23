import type {
  CartesianChartProps,
  CartesianChartSizes,
  CartesianChartsColors,
  CartesianChartsData,
} from '~/Components/Chart/CartesianCharts/utils/types';

/**
 * Draws horizontal lines on a chart.
 * Done based on values. Steps determined by max value and given amount of y-labels.
 * */
export function drawXDirLines(
  maxValue: number,
  yLabelCount: number,
  svgHeight: number,
  svgScale: number,
  bottomPadding: number,
  yLabelsPosition: number,
  svgWidth: number,
  colors: CartesianChartsColors,
) {
  const step = maxValue / yLabelCount;
  const lines = [];
  for (let i = 0; i <= yLabelCount; i++) {
    const value = step * i;
    const yPosition = svgHeight - value * svgScale - bottomPadding;
    lines.push(
      <line
        key={i}
        x1={yLabelsPosition + 10}
        x2={svgWidth - 10}
        y1={yPosition}
        y2={yPosition}
        style={{ stroke: colors.gridLines, strokeWidth: 0.75 }}
      />,
    );
  }
  return lines;
}

/*
 * Draws vertical lines, bases on a frequency.
 * Also influenced by number of data entries and size of chart.
 * Always draws the first and the last vertical line.
 * */
export function drawYDirLines(
  data: CartesianChartsData[],
  hLabelFreq: number,
  getX: (index: number) => number,
  svgHeight: number,
  bottomPadding: number,
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
  colors: CartesianChartsColors,
) {
  return data.map((_item, index) => {
    if (index % hLabelFreq === 0 || index === data.length - 1 || index === 0) {
      return (
        <line
          key={index}
          x1={getX(index)}
          x2={getX(index)}
          y1={sizes[size].yLabelsPosition}
          y2={svgHeight - bottomPadding}
          style={{ stroke: colors.gridLines, strokeWidth: 0.5 }}
        />
      );
    }

    return null;
  });
}
