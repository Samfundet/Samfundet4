import { ChartColors, ChartData } from '../utils/types';
import { Text } from '~/Components/Text/Text';
import styles from '../utils/Chart.module.scss';
import { MouseEvent, useState } from 'react';
import { HoverLabel } from '~/Components/Chart/Components/HoverLabel';
import { useIsDarkTheme } from '~/hooks';
import { dimensions } from '~/Components/Chart/utils/dimensions';
import { palette, sizes } from '~/Components/Chart/utils/apperance';

type BarChartProps = {
  chartTitle: string;
  data: ChartData[];
  size: 'small' | 'medium' | 'large' | 'xlarge';
  hAxisLegend: string;
  vAxisLegend: string;
  hLabelCount: number;
  spliceVLabel?: [number, number];
  spliceHLabel?: [number, number];
};

export function BarChart({
  chartTitle,
  data,
  hAxisLegend,
  vAxisLegend,
  size = 'medium',
  spliceVLabel,
  spliceHLabel,
  hLabelCount = 9,
}: BarChartProps) {
  const isDarkMode = useIsDarkTheme();
  const [hoverInfo, setHoverInfo] = useState({ value: '', x: 0, y: 0, visible: false });

  const handleMouseEnter = (event: MouseEvent<SVGPathElement>, value: string) => {
    setHoverInfo({
      value: value,
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  const handleMouseMove = (event: MouseEvent<SVGPathElement>) => {
    setHoverInfo((prev) => ({
      ...prev,
      x: event.clientX,
      y: event.clientY,
    }));
  };

  const handleMouseLeave = () => {
    setHoverInfo((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const {
    svgWidth,
    svgHeight,
    maxValue,
    hLabelFreq,
    svgScale,
    barPadding,
    hOffsetBars,
    vOffsetBars,
    xOffsetVLabels,
    yOffsetHLabels,
    chartWidth,
    thisBarWith,
  } = dimensions(sizes, size, data);

  const barChartPalette = palette;
  let colors: ChartColors;
  isDarkMode ? (colors = barChartPalette.dark) : (colors = barChartPalette.light);

  const newBars = data.map((item, index) => {
    const barHeight = item.value * svgScale;
    const xPosition = index * (thisBarWith + barPadding) + hOffsetBars; // Adjust to start after axis labels
    const yPosition = svgHeight - barHeight - vOffsetBars; // Leave space for labels
    const bar = (
      <rect
        x={xPosition}
        y={yPosition}
        width={thisBarWith}
        height={barHeight}
        fill={colors.bar}
        onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    );
    return { xPosition, yPosition, bar, barHeight };
  });

  const generateHorizontalLinesAndLabels = () => {
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
            style={{ stroke: palette.light.gridLines, strokeWidth: 0.75 }}
          />
          <text
            x={xOffsetVLabels}
            y={yPosition + 5} // Adjust the label position
            style={{ fontSize: sizes[size].labelFont }}
            fill="currentColor"
            textAnchor="end"
          >
            {spliceVLabel ? value.toFixed(0).toString().slice(spliceVLabel[0], spliceVLabel[1]) : value.toFixed(0)}
          </text>
        </g>,
      );
    }
    return lines;
  };

  const horizontalLinesAndLabels = generateHorizontalLinesAndLabels();

  const newHLabels = newBars.map(({ xPosition }, index) => {
    if (index % hLabelFreq === 0) {
      return (
        <text
          key={index}
          x={xPosition + thisBarWith / 2}
          y={svgHeight - yOffsetHLabels}
          fill="currentColor"
          style={{ fontSize: sizes[size].labelFont }}
          textAnchor="middle"
        >
          {spliceHLabel ? data[index].label.toString().slice(spliceHLabel[0], spliceHLabel[1]) : data[index].label}
        </text>
      );
    }
    return null;
  });

  return (
    <div className={styles.container} style={{ backgroundColor: colors.bg }}>
      <div className={styles.chartTitleContainer}>
        <Text as={'strong'} size={'xl'}>
          {chartTitle}
        </Text>
      </div>
      <div className={styles.vLegendContainer}>
        <Text className={styles.vAxisLegend}>{vAxisLegend}</Text>
      </div>
      <div className={styles.chartContainer}>
        <svg
          width={svgWidth}
          height={svgHeight}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {horizontalLinesAndLabels}
          {newBars.map(({ bar }) => bar)}
          {newHLabels}
        </svg>
      </div>
      <div className={styles.hLegendContainer}>
        <Text>{hAxisLegend}</Text>
      </div>

      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
