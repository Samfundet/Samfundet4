import { CartesianChartsData, CartesianChartProps, CartesianChartSizes, CartesianChartsColors } from './types';

export const drawYAxisLabels = (
  maxValue: number,
  yLabelCount: number,
  getYPosition: (value: number) => number,
  yLabelsPosition: number,
  spliceYLabel: [number, number] | undefined,
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
        {spliceYLabel ? value.toFixed(0).toString().slice(spliceYLabel[0], spliceYLabel[1]) : value.toFixed(0)}
      </text>,
    );
  }
  return lines;
};

export function drawXAxisLabels(
  data: CartesianChartsData[],
  xLabelFreq: number,
  spliceXLabel: [number, number] | undefined,
  getX: (index: number) => number,
  getY: () => number,
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
          y={getY()}
          style={{ fontSize: sizes[size].labelFont }}
          fill={colors.text}
          textAnchor="middle"
        >
          {spliceXLabel ? item.label.slice(spliceXLabel[0], spliceXLabel[1]) : item.label}
        </text>
      );
    }
    return null;
  });
}
