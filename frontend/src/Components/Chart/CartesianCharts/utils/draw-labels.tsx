import { CartesianChartsData, CartesianChartProps, CartesianChartSizes, CartesianChartsColors } from './types';

/**
 * Draws y-axis labels on a chart.
 * Steps determined by max value and given amount of y-labels through prop.
 * Allows for splitting the label string.
 * */
export const drawYAxisLabels = (
  maxValue: number,
  yLabelCount: number,
  getYPosition: (value: number) => number,
  yLabelsPosition: number,
  splitYLabel: [number, number] | undefined,
  colors: CartesianChartsColors,
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
) => {
  const step = maxValue / yLabelCount;
  const lines = [];
  for (let i = 0; i <= yLabelCount; i++) {
    const value = step * i;
    const yPosition = getYPosition(value);
    lines.push(
      <text
        key={i}
        x={yLabelsPosition}
        y={yPosition + sizes[size].labelFont / 2}
        style={{ fontSize: sizes[size].labelFont }}
        fill={colors.text}
        textAnchor="end"
      >
        {splitYLabel ? value.toFixed(0).toString().slice(splitYLabel[0], splitYLabel[1]) : value.toFixed(0)}
      </text>,
    );
  }
  return lines;
};

/*
 * Draws x-axis labels, bases on a frequency.
 * Also influenced by number of data entries and size of chart.
 * Always draws the first and the last label.
 * */
export function drawXAxisLabels(
  data: CartesianChartsData[],
  xLabelFreq: number,
  splitXLabel: [number, number] | undefined,
  getX: (index: number) => number,
  svgHeight: number,
  xLabelsMargin: number,
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
  colors: CartesianChartsColors,
) {
  return data.map((item, index) => {
    if (index % xLabelFreq === 0 || index === data.length - 1 || index === 0) {
      return (
        <text
          key={index}
          x={getX(index)}
          y={svgHeight - xLabelsMargin}
          style={{ fontSize: sizes[size].labelFont }}
          fill={colors.text}
          textAnchor="middle"
          // Rotate labels for better readability
          transform={`rotate(-45, ${getX(index)}, ${svgHeight - xLabelsMargin})`}
        >
          {splitXLabel ? item.label.slice(splitXLabel[0], splitXLabel[1]) : item.label}
        </text>
      );
    }
    return null;
  });
}
