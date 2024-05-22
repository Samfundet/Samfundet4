import {
  CartesianChartProps,
  CartesianChartsData,
  CartesianChartSizes,
} from '~/Components/Chart/CartesianCharts/utils/types';

const getDatapointPadding = (entryCount: number) => (entryCount > 80 ? 1 : 2);

const calculateDimensions = (
  sizes: CartesianChartSizes,
  size: CartesianChartProps['size'],
  data: CartesianChartsData[],
) => {
  const leftPadding = sizes[size].leftPadding;
  const bottomPadding = sizes[size].bottomPadding;
  const rightPadding = sizes[size].rightPadding;
  const topPadding = sizes[size].topPadding;

  const yLabelsPosition = sizes[size].yLabelsPosition;
  const xLabelsMargin = sizes[size].xLabelsMargin;

  const svgWidth = sizes[size].cWith + rightPadding + leftPadding + xLabelsMargin;
  const svgHeight = sizes[size].cHeight + topPadding + bottomPadding + yLabelsPosition;

  const chartWidth = sizes[size].cWith;
  const chartHeight = sizes[size].cHeight;

  const maxValue = Math.max(...data.map((item) => item.value));

  const svgScale = chartHeight / maxValue;

  const entryCount = data.length;
  const datapointPadding = getDatapointPadding(entryCount);
  const totalBarPadding = (entryCount - 1) * datapointPadding;

  const datapointWidth = (chartWidth - totalBarPadding) / entryCount;
  let xLabelFreq = 2;
  if (entryCount >= 12) {
    if (size === 'large' || size === 'xlarge') {
      xLabelFreq = Math.ceil(entryCount / 8);
    } else if (size === 'small' || size === 'medium') {
      xLabelFreq = Math.ceil(entryCount / 3);
    }
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
