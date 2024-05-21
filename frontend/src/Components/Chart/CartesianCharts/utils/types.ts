export type CartesianChartsData = {
  label: string;
  value: number;
};

export type CartesianChartProps = {
  chartTitle: string;
  data: CartesianChartsData[];
  size: 'small' | 'medium' | 'large' | 'xlarge';
  hAxisLegend: string;
  vAxisLegend: string;
  hLabelCount: number;
  spliceVLabel?: [number, number];
  spliceHLabel?: [number, number];
};

export type CartesianChartsSize = {
  cWith: number;
  cHeight: number;
  labelFont: number;
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
