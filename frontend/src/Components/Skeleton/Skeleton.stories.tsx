import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

// Local component config.
const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    width: '100%',
    height: '1em',
    borderRadius: '0.25rem',
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Basic: Story = {
  args: {},
};

export const Wide: Story = {
  args: {
    width: '20em',
    height: '2em',
  },
};

export const Circle: Story = {
  args: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
  },
};
