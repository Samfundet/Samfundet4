import type { CartesianChartsColors, CartesianChartProps } from '~/Components/Chart/CartesianCharts/utils/types';
import { HoverLabel, useHoverLabel } from '~/Components/Chart/Components/HoverLabel';
import styles from '../CartesianCharts.module.scss';
import { useIsDarkTheme } from '~/hooks';
import { Text } from '~/Components/Text/Text';
import { drawXAxisLabels, drawYAxisLabels } from '~/Components/Chart/CartesianCharts/utils/draw-labels';
import { drawXDirLines, drawYDirLines } from '~/Components/Chart/CartesianCharts/utils/draw-lines';
import { palette, sizes } from '~/Components/Chart/CartesianCharts/utils/apperance';
import { dimensions } from '~/Components/Chart/CartesianCharts/utils/dimensions';

export function BarChart({
  data,
  chartTitle,
  size,
  xAxisLegend,
  yAxisLegend,
  splitYLabel,
  splitXLabel,
  yLabelCount,
  hasXDirLines = true,
  hasYDirLines = false,
  yLabelMagnitude,
  xLabelMagnitude,
}: CartesianChartProps) {
  const { hoverInfo, handleMouseEnter, handleMouseMove, handleMouseLeave } = useHoverLabel();
  const isDarkMode = useIsDarkTheme();

  const {
    svgWidth,
    svgHeight,
    maxValue,
    xLabelFreq,
    svgScale,
    datapointPadding,
    leftPadding,
    bottomPadding,
    yLabelsPosition,
    xLabelsMargin,
    datapointWidth,
  } = dimensions(sizes, size, data); // function which hold/calculate dimensions or other needed values.

  const colors: CartesianChartsColors = isDarkMode ? palette.dark : palette.light;

  /*
   * Draws bars for the chart.
   * */
  const dataBars = data.map((item, index) => {
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

  const xAxisLabels = drawXAxisLabels(
    data,
    xLabelFreq,
    (index) => dataBars[index].xPosition + datapointWidth / 2, // gets x-pos of bar center
    svgHeight,
    xLabelsMargin,
    sizes,
    size,
    colors,
    splitXLabel,
    xLabelMagnitude,
  );

  const yAxisLabels = drawYAxisLabels(
    maxValue,
    yLabelCount,
    (value) => svgHeight - value * svgScale - bottomPadding, // gets y-coordinate
    yLabelsPosition,
    colors,
    sizes,
    size,
    splitYLabel,
    yLabelMagnitude,
  );

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: colors.background, minWidth: svgWidth, minHeight: svgHeight }}
    >
      <div className={styles.chartTitleContainer}>
        <Text as={'strong'} size={'xl'}>
          {chartTitle}
        </Text>
      </div>
      <div className={styles.vLegendContainer}>
        <Text className={styles.vAxisLegend}>{yAxisLegend}</Text>
      </div>
      <div className={styles.chartContainer}>
        <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
          {hasYDirLines && // executes if vertical lines prop is true
            drawYDirLines(
              data,
              xLabelFreq,
              (index) => dataBars[index].xPosition + datapointWidth / 2, // gets x-pos of bar center
              svgHeight,
              bottomPadding,
              sizes,
              size,
              colors,
            )}
          {hasXDirLines && // executes if horizontal lines prop is true
            drawXDirLines(maxValue, yLabelCount, svgHeight, svgScale, bottomPadding, yLabelsPosition, svgWidth, colors)}
          {yAxisLabels}
          {xAxisLabels}
          {dataBars.map((barData) => barData.bar)}
        </svg>
      </div>
      <div className={styles.hLegendContainer}>
        <Text>{xAxisLegend}</Text>
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
