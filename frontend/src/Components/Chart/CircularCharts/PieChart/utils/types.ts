export type CircularChartData = {
  label: string;
  value: number;
};

export type CircularChartProps = {
  chartTitle: string;
  data: CircularChartData[];
  size: 'small' | 'medium' | 'large' | 'xlarge';
  legend: string;
};

export type CircularChartSize = {
  cWith: number;
  cHeight: number;
  horizontalPadding: number;
};

export type CircularChartSizes = {
  small: CircularChartSize;
  medium: CircularChartSize;
  large: CircularChartSize;
  xlarge: CircularChartSize;
};
