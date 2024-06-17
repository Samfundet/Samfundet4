import { COLORS } from '~/types';
import { CartesianChartPalette, CartesianChartSizes } from './types';

/*
 * Sizes of the cartesian charts.
 * Update if needed.
 * */

export const sizes: CartesianChartSizes = {
  small: {
    width: 325,
    height: 183,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
  medium: {
    width: 450,
    height: 253,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
  large: {
    width: 600,
    height: 337,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
  xlarge: {
    width: 800,
    height: 450,
    labelFont: 14,
    topPadding: 0,
    rightPadding: 10,
    bottomPadding: 40,
    leftPadding: 45,
    xLabelsMargin: 15,
    yLabelsPosition: 25,
  },
};

/*
 * Color palette of cartesian charts.
 * */

export const palette: CartesianChartPalette = {
  dark: {
    foreground: COLORS.white,
    bar: COLORS.salmon,
    hoverBar: COLORS.salmon_light,
    background: COLORS.blue_deeper,
    gridLines: COLORS.grey_4,
  },
  light: {
    foreground: COLORS.black,
    bar: COLORS.blue_deep,
    hoverBar: COLORS.blue_medium,
    background: COLORS.background_secondary,
    gridLines: COLORS.grey_2,
  },
};
