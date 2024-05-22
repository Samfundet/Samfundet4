import {
  CartesianChartProps,
  CartesianChartsData,
  CartesianChartSizes,
} from '~/Components/Chart/CartesianCharts/utils/types';

/*
 * Determines the spacing between bars. 1px if there are more than 80 entries, 2px if less.
 * */
const getDatapointPadding = (entryCount: number) => (entryCount > 80 ? 1 : 2);

const calculateDimensions = (
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
  data: CartesianChartsData[],
) => {
  const { leftPadding, bottomPadding, rightPadding, topPadding, yLabelsPosition, xLabelsMargin, cWith, cHeight } =
    sizes[size];

  const svgWidth = cWith + rightPadding + leftPadding + xLabelsMargin;
  const svgHeight = cHeight + topPadding + bottomPadding + yLabelsPosition;

  // after adding padding and margin this should be the chart width and height
  const chartWidth = sizes[size].cWith;
  const chartHeight = sizes[size].cHeight;

  const maxValue = Math.max(...data.map((item) => item.value));

  const svgScale = chartHeight / maxValue;

  const entryCount = data.length; // data; a list of "data points"
  const datapointPadding = getDatapointPadding(entryCount); // spacing between bars or points
  const totalDataPointPadding = (entryCount - 1) * datapointPadding; // the total width taken up by "space between points/bars"

  const datapointWidth = (chartWidth - totalDataPointPadding) / entryCount;

  // Calculate xLabelFreq dynamically based on the size of the chart
  let xLabelFreq;
  if (size === 'large' || size === 'xlarge') {
    xLabelFreq = Math.max(1, Math.ceil(entryCount / 7));
  } else if (size === 'medium') {
    xLabelFreq = Math.max(1, Math.ceil(entryCount / 5));
  } else {
    // size === 'small' or other sizes
    xLabelFreq = Math.max(1, Math.ceil(entryCount / 3));
  }

  // Ensure a minimum number of labels are shown if there are very few data points
  if (entryCount <= 3) {
    xLabelFreq = 1;
  }

  return {
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
    chartWidth,
    datapointWidth,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dimensions(sizes: CartesianChartSizes, size: CartesianChartProps['size'], data: CartesianChartsData[]) {
  return calculateDimensions(sizes, size, data);
}
