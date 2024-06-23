import type { CartesianChartProps, CartesianChartSizes, CartesianChartsColors, CartesianChartsData } from './types';

// processing single label text item
const labelText = (labelValue: string | number, labelMagnitude?: number, splitLabel?: [number, number]): string => {
  let labelText = '';

  if (labelMagnitude && typeof labelValue === 'number' && (labelMagnitude % 10 === 0 || labelMagnitude === 1)) {
    // Divide the label value by the magnitude and convert to string
    labelText = Math.floor(labelValue / labelMagnitude).toString();
  } else if (typeof labelValue === 'string') {
    // Shorten the label string if splitYLabel is provided
    if (splitLabel) {
      labelText = labelValue.slice(splitLabel[0], splitLabel[1]);
    } else {
      labelText = labelValue; // Use the original string if no split range is provided or magnitude is not given
    }
  }
  return labelText;
};

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
  colors: CartesianChartsColors,
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
  splitYLabel?: [number, number] | undefined,
  yLabelMagnitude?: number,
) => {
  const step = maxValue / yLabelCount;
  const lines = [];
  for (let i = 0; i <= yLabelCount; i++) {
    const value = step * i;
    const yPosition = getYPosition(value);
    // splits label string or devices it based on given magnitude
    const label = labelText(value, yLabelMagnitude, splitYLabel);
    lines.push(
      <text
        key={i}
        x={yLabelsPosition}
        y={yPosition + sizes[size].labelFont / 2}
        style={{ fontSize: sizes[size].labelFont }}
        fill={colors.foreground}
        textAnchor="end"
      >
        {label}
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

  getX: (index: number) => number,
  svgHeight: number,
  xLabelsMargin: number,
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
  colors: CartesianChartsColors,
  splitXLabel?: [number, number],
  xLabelMagnitude?: number,
) {
  return data.map((item, index) => {
    const label = labelText(item.label, xLabelMagnitude, splitXLabel);
    if (index % xLabelFreq === 0 || index === data.length - 1 || index === 0) {
      return (
        <text
          key={index}
          x={getX(index)}
          y={svgHeight - xLabelsMargin}
          style={{ fontSize: sizes[size].labelFont }}
          fill={colors.foreground}
          textAnchor="middle"
          // Rotate labels for better readability
          transform={`rotate(-45, ${getX(index)}, ${svgHeight - xLabelsMargin})`}
        >
          {label}
        </text>
      );
    }
    return null;
  });
}
