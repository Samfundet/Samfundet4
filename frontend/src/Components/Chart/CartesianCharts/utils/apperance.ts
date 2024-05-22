import { COLORS } from '~/types';
import { CartesianChartPalette, CartesianChartSizes } from './types';

export const sizes: CartesianChartSizes = {
  small: {
    cWith: 325,
    cHeight: 183,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
  medium: {
    cWith: 450,
    cHeight: 253,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
  large: {
    cWith: 600,
    cHeight: 337,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
  xlarge: {
    cWith: 800,
    cHeight: 450,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
};

export const palette: CartesianChartPalette = {
  dark: {
    text: COLORS.white,
    bar: COLORS.salmon,
    hoverBar: COLORS.salmon_light,
    bg: COLORS.blue_deeper,
    gridLines: COLORS.grey_4,
  },
  light: {
    text: COLORS.black,
    bar: COLORS.blue_deep,
    hoverBar: COLORS.blue_medium,
    bg: COLORS.background_secondary,
    gridLines: COLORS.grey_2,
  },
};
