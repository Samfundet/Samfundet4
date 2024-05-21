import { CartesianChartsColors } from '~/Components/Chart/CartesianCharts/utils/types';

export function drawHorizontalLines(
  maxValue: number,
  hLabelCount: number,
  svgHeight: number,
  svgScale: number,
  vOffsetBars: number,
  hOffsetBars: number,
  chartWidth: number,
  colors: CartesianChartsColors,
) {
  const step = maxValue / hLabelCount;
  const lines = [];
  for (let i = 0; i <= hLabelCount; i++) {
    const value = step * i;
    const yPosition = svgHeight - value * svgScale - vOffsetBars;
    lines.push(
      <line
        key={i}
        x1={hOffsetBars}
        x2={chartWidth}
        y1={yPosition}
        y2={yPosition}
        style={{ stroke: colors.gridLines, strokeWidth: 0.75 }}
      />,
    );
  }
  return lines;
}
