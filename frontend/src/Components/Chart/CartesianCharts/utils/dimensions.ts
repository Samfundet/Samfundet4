import { CartesianChartsData, ChartProps, CartesianChartSizes } from './types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dimensions(sizes: CartesianChartSizes, size: ChartProps['size'], data: CartesianChartsData[]) {
  const svgWidth = sizes[size].cWith; // svg width
  const svgHeight = sizes[size].cHeight; // svg height
  const topPadding = 70; // datapoint offset from top
  const maxValue = Math.max(...data.map((item: CartesianChartsData) => item.value));
  const svgScale = (svgHeight - topPadding) / maxValue;

  const maxValueStrLength = maxValue.toString().length; //length of the string representing the value
  const leftPadding = maxValueStrLength * sizes[size].labelFont + 30; // horizontal offset

  const bottomPadding = 40; // chart vertical offset

  const vertLabelsRightPadding = leftPadding - 20;

  const hrzntLabelsBottomPadding = bottomPadding - sizes[size].labelFont - 10;

  const entryCount = data.length;
  let datapointPadding: number;
  entryCount > 80 ? (datapointPadding = 1) : (datapointPadding = 2);
  const totalBarPadding = (entryCount - 1) * datapointPadding;

  const datapointWidth = (svgWidth - bottomPadding - vertLabelsRightPadding - totalBarPadding) / entryCount;
  const chartWidth = totalBarPadding + datapointWidth * entryCount + bottomPadding + vertLabelsRightPadding;

  let hLabelFreq: number = 2;
  if (entryCount >= 12) {
    if (size === 'large' || size === 'xlarge') {
      hLabelFreq = Math.ceil(entryCount / 8);
    } else if (size === 'small' || size === 'medium') {
      hLabelFreq = Math.ceil(entryCount / 4);
    }
  }
  return {
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
  };
}
