import { CartesianChartsColors, CartesianChartProps } from '~/Components/Chart/CartesianCharts/utils/types';
import { HoverLabel, useHoverLabel } from '~/Components/Chart/Components/HoverLabel';
import styles from '../CartesianCharts.module.scss';
import { useIsDarkTheme } from '~/hooks';
import { Text } from '~/Components/Text/Text';
import { createHorizontalLabels, drawVertLabels } from '~/Components/Chart/CartesianCharts/utils/draw-labels';
import { drawHorizontalLines } from '~/Components/Chart/CartesianCharts/utils/draw-lines';
import { palette, sizes } from '~/Components/Chart/CartesianCharts/utils/apperance';
import { dimensions } from '~/Components/Chart/CartesianCharts/utils/dimensions';

//TODO: add more properties to sizes
export function BarChart({
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

  const newBars = data.map((item, index) => {
    const barHeight = item.value * svgScale;
    const xPosition = index * (datapointWidth + datapointPadding) + leftPadding; // Adjust to start after axis labels
    const yPosition = svgHeight - barHeight - bottomPadding; // Leave space for labels
    const bar = (
      <rect
        key={index}
        x={xPosition}
        y={yPosition}
        width={datapointWidth}
        height={barHeight}
        fill={colors.bar}
        onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    );
    return { xPosition, yPosition, bar, barHeight };
  });

  const vertLabels = createHorizontalLabels(
    data,
    hLabelFreq,
    spliceHLabel,
    (index) => newBars[index].xPosition + datapointWidth / 2, // Center of the bar
    () => svgHeight - hrzntLabelsBottomPadding,
    sizes,
    size,
    colors,
  );

  const horizontalLabels = drawVertLabels(
    maxValue,
    hLabelCount,
    (value) => svgHeight - value * svgScale - bottomPadding,
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
    vertLabelsRightPadding,
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
        <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
          {horizontalLabels}
          {vertLabels}
          {horizontalLines}
          {newBars.map((barData) => barData.bar)}
        </svg>
      </div>
      <div className={styles.hLegendContainer}>
        <Text>{hAxisLegend}</Text>
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
