import { CartesianChartsData, ChartProps, CartesianChartSizes, CartesianChartsColors } from './types';

export function createHorizontalLabels(
  data: CartesianChartsData[],
  hLabelFreq: number,
  spliceHLabel: [number, number] | undefined,
  getX: (index: number) => number,
  getY: () => number,
  sizes: CartesianChartSizes,
  size: ChartProps['size'],
  colors: CartesianChartsColors,
) {
  return data.map((item, index) => {
    if (index % hLabelFreq === 0) {
      return (
        <text
          key={index}
          x={getX(index)}
          y={getY()}
          style={{ fontSize: sizes[size].labelFont }}
          fill={colors.text}
          textAnchor="middle"
        >
          {spliceHLabel ? item.label.slice(spliceHLabel[0], spliceHLabel[1]) : item.label}
        </text>
      );
    }
    return null;
  });
}

export const drawVertLabels = (
  maxValue: number,
  hLabelCount: number,
  getYPosition: (value: number) => number,
  xOffsetVLabels: number,
  spliceVLabel: [number, number] | undefined,
  colors: CartesianChartsColors,
  sizes: CartesianChartSizes,
  size: ChartProps['size'],
) => {
  const step = maxValue / hLabelCount;
  const lines = [];
  for (let i = 0; i <= hLabelCount; i++) {
    const value = step * i;
    const yPosition = getYPosition(value);
    lines.push(
      <text
        key={i}
        x={xOffsetVLabels}
        y={yPosition + 5}
        style={{ fontSize: sizes[size].labelFont }}
        fill={colors.text}
        textAnchor="end"
      >
        {spliceVLabel ? value.toFixed(0).toString().slice(spliceVLabel[0], spliceVLabel[1]) : value.toFixed(0)}
      </text>,
    );
  }
  return lines;
};
