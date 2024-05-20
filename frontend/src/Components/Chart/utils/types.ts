export type ChartData = {
  label: string;
  value: number;
};

export type ChartProps = {
  chartTitle: string;
  data: ChartData[];
  size: 'small' | 'medium' | 'large' | 'xlarge';
  labelSpliceStart?: number;
  labelSpliceEnd?: number;
  vAxisLabel?: string;
  hAxisLabel?: string;
  maxBarWidth?: number;
  minBarWidth?: number;
};

export type ChartSize = {
  cWith: number;
  cHeight: number;
  labelFont: number;
};

export type ChartSizes = {
  small: ChartSize;
  medium: ChartSize;
  large: ChartSize;
  xlarge: ChartSize;
};

export type ChartColors = {
  bar: string;
  bg: string;
  text: string;
  hoverBar: string;
  gridLines: string;
};

export type ChartPalette = {
  dark: ChartColors;
  light: ChartColors;
};
