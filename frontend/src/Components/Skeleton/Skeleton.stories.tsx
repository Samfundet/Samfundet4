import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

// Local component config.
const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  // Using defaults from:
  // https://www.npmjs.com/package/react-loading-skeleton
  args: {
    className: '',
    count: 1,
    baseColor: '',
    highlightColor: '',
    circle: false,
    borderRadius: '0.25rem',
    direction: 'ltr',
    duration: 1.5,
    enableAnimation: true,
    height: '',
    width: '100%',
    inline: false,
    style: {},
    containerClassName: '',
    containerTestId: '',
    wrapper: undefined,
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Basic: Story = {
  args: {},
};

export const Multiple: Story = {
  args: { count: 10 },
};

export const OtherColors: Story = {
  args: {
    baseColor: '#a03033',
    highlightColor: 'gold',
  },
};

export const Circle: Story = {
  args: {
    circle: true,
    width: '200px',
    height: '200px',
  },
};

export const Eyes: Story = {
  args: {
    circle: true,
    width: '200px',
    height: '200px',
    direction: 'rtl',
    inline: true,
    duration: 2,
    baseColor: 'yellow',
    highlightColor: 'black',
    count: 2,
  },
};
