import { COLORS } from '~/types';
import { ChartPalette, ChartSizes } from './types';

export const sizes: ChartSizes = {
  small: { cWith: 325, cHeight: 183, labelFont: 14 },
  medium: { cWith: 450, cHeight: 253, labelFont: 14 },
  large: { cWith: 600, cHeight: 337, labelFont: 14 },
  xlarge: { cWith: 800, cHeight: 450, labelFont: 14 },
};

export const palette: ChartPalette = {
  dark: { text: COLORS.white, bar: '#FA8072', hoverBar: '#fbb4ac', bg: COLORS.blue_deeper, gridLines: COLORS.grey_4 },
  light: {
    text: COLORS.black,
    bar: COLORS.blue_deep,
    hoverBar: COLORS.blue_medium,
    bg: COLORS.background_secondary,
    gridLines: COLORS.grey_2,
  },
};
