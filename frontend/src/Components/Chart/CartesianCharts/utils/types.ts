export type CartesianChartsData = {
  label: string;
  value: number;
};

export type CartesianChartProps = {
  chartTitle: string;
  data: CartesianChartsData[];
  size: 'small' | 'medium' | 'large' | 'xlarge';
  xAxisLegend: string;
  yAxisLegend: string;
  yLabelCount: number;
  hasXDirLines: boolean;
  hasYDirLines: boolean;
  spliceYLabel?: [number, number];
  spliceXLabel?: [number, number];
};

export type CartesianChartsSize = {
  cWith: number;
  cHeight: number;
  labelFont: number;
  topPadding: number;
  rightPadding: number;
  bottomPadding: number;
  leftPadding: number;
  xLabelsMargin: number;
  yLabelsPosition: number;
};

export type CartesianChartSizes = {
  small: CartesianChartsSize;
  medium: CartesianChartsSize;
  large: CartesianChartsSize;
  xlarge: CartesianChartsSize;
};

export type CartesianChartsColors = {
  bar: string;
  bg: string;
  text: string;
  hoverBar: string;
  gridLines: string;
};

export type CartesianChartPalette = {
  dark: CartesianChartsColors;
  light: CartesianChartsColors;
};
