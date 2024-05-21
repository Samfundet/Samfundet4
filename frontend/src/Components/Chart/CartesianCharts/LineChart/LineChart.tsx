import { CartesianChartsColors, CartesianChartProps } from '~/Components/Chart/CartesianCharts/utils/types';
import { HoverLabel, useHoverLabel } from '~/Components/Chart/Components/HoverLabel';
import styles from '../CartesianCharts.module.scss';
import { useIsDarkTheme } from '~/hooks';
import { Text } from '~/Components/Text/Text';
import { createHorizontalLabels, drawVertLabels } from '~/Components/Chart/CartesianCharts/utils/draw-labels';
import { drawHorizontalLines } from '~/Components/Chart/CartesianCharts/utils/draw-lines';
import { palette, sizes } from '~/Components/Chart/CartesianCharts/utils/apperance';
import { dimensions } from '~/Components/Chart/CartesianCharts/utils/dimensions';

export function LineChart({
  data,
  chartTitle,
  size,
  hAxisLegend,
  vAxisLegend,
  spliceVLabel,
  spliceHLabel,
  hLabelCount,
}: CartesianChartProps) {
  const { hoverInfo, handleMouseEnter, handleMouseMove, handleMouseLeave } = useHoverLabel();
  const isDarkMode = useIsDarkTheme();

  const {
    svgWidth,
    svgHeight,
    maxValue,
    hLabelFreq,
    svgScale,
    datapointPadding,
    leftPadding,
    bottomPadding,
    vertLabelsRightPadding,
    hrzntLabelsBottomPadding,
    chartWidth,
    datapointWidth,
  } = dimensions(sizes, size, data);

  const lineChartPalette = palette;
  let colors: CartesianChartsColors;

  isDarkMode ? (colors = lineChartPalette.dark) : (colors = lineChartPalette.light);

  const lineCoordinates = data.map((item, index) => ({
    x: index * (datapointWidth + datapointPadding) + vertLabelsRightPadding + datapointWidth / 2,
    y: svgHeight - item.value * svgScale - bottomPadding,
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

  const vertLabels = createHorizontalLabels(
    data,
    hLabelFreq,
    spliceHLabel,
    (index) => lineCoordinates[index].x, // Function to get x-coordinate
    () => svgHeight - hrzntLabelsBottomPadding, // Function to get y-coordinate
    sizes,
    size,
    colors,
  );

  const horizontalLabels = drawVertLabels(
    maxValue,
    hLabelCount,
    (value) => svgHeight - value * svgScale - bottomPadding, // Function to get y-coordinate
    vertLabelsRightPadding,
    spliceVLabel,
    colors,
    sizes,
    size,
  );

  const horizontalLines = drawHorizontalLines(
    maxValue,
    hLabelCount,
    svgHeight,
    svgScale,
    bottomPadding,
    leftPadding,
    chartWidth,
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
          {horizontalLabels}
          {vertLabels}
          {horizontalLines}
          <path d={linePath} fill="none" stroke={colors.bar} strokeWidth="3" />
          {dataPoints}
        </svg>
      </div>
      <div className={styles.hLegendContainer}>
        <Text>{hAxisLegend}</Text>
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
