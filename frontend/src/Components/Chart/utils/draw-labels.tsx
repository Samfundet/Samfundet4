import { ChartData, ChartProps, ChartSizes, ChartColors } from './types';

// labels at the bottom of the chart
export function createHorizontalLabels(
  data: ChartData[],
  hLabelFreq: number,
  spliceHLabel: [number, number] | undefined,
  lineCoordinates: { x: number; y: number }[],
  svgHeight: number,
  yOffsetHLabels: number,
  sizes: ChartSizes,
  size: ChartProps['size'],
  colors: ChartColors,
) {
  return data.map((item, index) => {
    if (index % hLabelFreq === 0) {
      return (
        <text
          key={index}
          x={lineCoordinates[index].x}
          y={svgHeight - yOffsetHLabels}
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

export const createVertLabelsLines = (
  maxValue: number,
  hLabelCount: number,
  svgHeight: number,
  svgScale: number,
  vOffsetBars: number,
  hOffsetBars: number,
  chartWidth: number,
  xOffsetVLabels: number,
  spliceVLabel: [number, number] | undefined,
  colors: ChartColors,
  sizes: ChartSizes,
  size: ChartProps['size'],
) => {
  const step = maxValue / hLabelCount;
  const lines = [];
  for (let i = 0; i <= hLabelCount; i++) {
    const value = step * i;
    const yPosition = svgHeight - value * svgScale - vOffsetBars;
    lines.push(
      <g key={i}>
        <line
          x1={hOffsetBars}
          x2={chartWidth}
          y1={yPosition}
          y2={yPosition}
          style={{ stroke: colors.gridLines, strokeWidth: 0.75 }}
        />
        <text
          x={xOffsetVLabels}
          y={yPosition + 5} // Adjust the label position
          style={{ fontSize: sizes[size].labelFont }}
          fill={colors.text}
          textAnchor="end"
        >
          {spliceVLabel ? value.toFixed(0).toString().slice(spliceVLabel[0], spliceVLabel[1]) : value.toFixed(0)}
        </text>
      </g>,
    );
  }
  return lines;
};
