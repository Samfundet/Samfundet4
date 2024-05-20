import { ChartData, ChartProps, ChartSizes } from './types';

export function dimensions(sizes: ChartSizes, size: ChartProps['size'], data: ChartData[]) {
  const svgWidth = sizes[size].cWith; // svg width
  const svgHeight = sizes[size].cHeight; // svg height
  const bHeightOffset = 70; // bar height offset
  const maxValue = Math.max(...data.map((item: ChartData) => item.value));
  const svgScale = (svgHeight - bHeightOffset) / maxValue;
  const entryCount = data.length;
  let barPadding: number;
  let hLabelFreq: number = 2; // Initialize hLabelFreq to a default value

  entryCount > 80 ? (barPadding = 1) : (barPadding = 2);

  if (entryCount >= 12) {
    if (size === 'large' || size === 'xlarge') {
      hLabelFreq = Math.ceil(entryCount / 8);
    } else if (size === 'small' || size === 'medium') {
      hLabelFreq = Math.ceil(entryCount / 4);
    }
  }

  const maxValueLength = maxValue.toString().length;
  const hOffsetBars = maxValueLength * sizes[size].labelFont + 30; // horizontal offset
  const vOffsetBars = 40; // bars vertical offset

  // offset of vertical labels in x,y dir
  const xOffsetVLabels = hOffsetBars - 20;

  // offset horizontal labels in x dir
  const yOffsetHLabels = vOffsetBars - sizes[size].labelFont - 10;

  const totalBarPadding = (entryCount - 1) * barPadding;

  const thisBarWith = (svgWidth - vOffsetBars - xOffsetVLabels - totalBarPadding) / entryCount;
  const chartWidth = totalBarPadding + thisBarWith * entryCount + vOffsetBars + xOffsetVLabels;

  return {
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
  };
}
