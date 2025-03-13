import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

// Local component config.
const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Low: Story = {
  args: {
    value: 25,
    max: 100,
  },
};

export const Medium: Story = {
  args: {
    value: 50,
    max: 100,
  },
};

export const High: Story = {
  args: {
    value: 75,
    max: 100,
  },
};

export const Loading: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: { children: <div>Label</div> },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};
