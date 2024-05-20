import { ChartData, ChartColors } from '../utils/types';
import { MouseEvent, useState } from 'react';
import { HoverLabel } from '~/Components/Chart/Components/HoverLabel';
import styles from '../utils/Chart.module.scss';
import { useIsDarkTheme } from '~/hooks';
import { Text } from '~/Components/Text/Text';
import { createHorizontalLabels, createVertLabelsLines } from '~/Components/Chart/utils/draw-labels';
import { palette, sizes } from '~/Components/Chart/utils/apperance';
import { dimensions } from '~/Components/Chart/utils/dimensions';

type LineChartProps = {
  chartTitle: string;
  data: ChartData[];
  size: 'small' | 'medium' | 'large' | 'xlarge';
  hAxisLegend: string;
  vAxisLegend: string;
  hLabelCount: number;
  spliceVLabel?: [number, number];
  spliceHLabel?: [number, number];
};

export function LineChart({
  data,
  chartTitle,
  size = 'medium',
  hAxisLegend,
  vAxisLegend,
  spliceVLabel,
  spliceHLabel,
  hLabelCount = 9,
}: LineChartProps) {
  const [hoverInfo, setHoverInfo] = useState({ value: '', x: 0, y: 0, visible: false });
  const isDarkMode = useIsDarkTheme();

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

  const lineChartPalette = palette;
  let colors: ChartColors;

  isDarkMode ? (colors = lineChartPalette.dark) : (colors = lineChartPalette.light);

  const lineCoordinates = data.map((item, index) => ({
    x: index * (thisBarWith + barPadding) + xOffsetVLabels + thisBarWith / 2,
    y: svgHeight - item.value * svgScale - vOffsetBars,
  }));

  const linePath = `M${lineCoordinates.map((coord) => `${coord.x},${coord.y}`).join('L')}`;

  const dataPoints = data.map((item, index) => (
    <circle
      key={index}
      cx={lineCoordinates[index].x}
      cy={lineCoordinates[index].y}
      r={5}
      fill={colors.bar}
      onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value.toString())}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  ));

  const horizontalLinesAndLabels = createVertLabelsLines(
    maxValue,
    hLabelCount,
    svgHeight,
    svgScale,
    vOffsetBars,
    hOffsetBars,
    chartWidth,
    xOffsetVLabels,
    spliceVLabel,
    colors,
    sizes,
    size,
  );

  const vertLabels = createHorizontalLabels(
    data,
    hLabelFreq,
    spliceHLabel,
    lineCoordinates,
    svgHeight,
    yOffsetHLabels,
    sizes,
    size,
    colors,
  );

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
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {horizontalLinesAndLabels}
          <path d={linePath} fill="none" stroke={colors.bar} strokeWidth="3" />
          {dataPoints}
          {vertLabels}
        </svg>
      </div>
      <div className={styles.hLegendContainer}>
        <Text>{hAxisLegend}</Text>
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
