import { CartesianChartsColors, CartesianChartProps } from '~/Components/Chart/CartesianCharts/utils/types';
import { HoverLabel, useHoverLabel } from '~/Components/Chart/Components/HoverLabel';
import styles from '../CartesianCharts.module.scss';
import { useIsDarkTheme } from '~/hooks';
import { Text } from '~/Components/Text/Text';
import { drawXAxisLabels, drawYAxisLabels } from '~/Components/Chart/CartesianCharts/utils/draw-labels';
import { drawXDirLines, drawYDirLines } from '~/Components/Chart/CartesianCharts/utils/draw-lines';
import { palette, sizes } from '~/Components/Chart/CartesianCharts/utils/apperance';
import { dimensions } from '~/Components/Chart/CartesianCharts/utils/dimensions';

export function LineChart({
  data,
  chartTitle,
  size,
  xAxisLegend,
  yAxisLegend,
  splitYLabel,
  splitXLabel,
  yLabelCount,
  hasXDirLines = true,
  hasYDirLines = true,
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
    bottomPadding,
    yLabelsPosition,
    xLabelsMargin,
    datapointWidth,
  } = dimensions(sizes, size, data); // function which hold/calculate dimensions or other needed values.

  const colors: CartesianChartsColors = isDarkMode ? palette.dark : palette.light;
  /*
   * Creates a list of coordinates for drawing a data-line.
   * */
  const lineCoordinates: { x: number; y: number }[] = data.map((item, index) => ({
    x: index * (datapointWidth + datapointPadding) + yLabelsPosition + datapointWidth / 2,
    y: svgHeight - item.value * svgScale - bottomPadding,
  }));

  // creates svg specification for data-line.
  const linePath = `M${lineCoordinates.map((coord) => `${coord.x},${coord.y}`).join('L')}`;

  /*
   * Draws data points at he "breaks"/ in the data line.
   * */
  const dataPoints = data.map((item, index) => (
    <circle
      key={index}
      cx={lineCoordinates[index].x}
      cy={lineCoordinates[index].y}
      r={4} // radius of point
      fill={colors.bar}
      onMouseEnter={(event) => handleMouseEnter(event, item.label + ': ' + item.value.toString())}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  ));

  const xAxisLabels = drawXAxisLabels(
    data,
    xLabelFreq,
    (index) => lineCoordinates[index].x, // Function to get x-coordinate
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
    (value) => svgHeight - value * svgScale - bottomPadding, // Function to get y-coordinate
    yLabelsPosition,
    colors,
    sizes,
    size,
    splitYLabel,
    yLabelMagnitude,
  );

  return (
    <div className={styles.container} style={{ backgroundColor: colors.bg, minWidth: svgWidth, minHeight: svgHeight }}>
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
              (index) => lineCoordinates[index].x, // Function to get x-coordinate
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
          <path d={linePath} fill="none" stroke={colors.bar} strokeWidth="3" />
          {dataPoints}
        </svg>
      </div>
      <div className={styles.hLegendContainer}>
        <Text>{xAxisLegend}</Text>
      </div>
      <HoverLabel hoverInfo={hoverInfo} />
    </div>
  );
}
