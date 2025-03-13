import type { Meta, StoryObj } from '@storybook/react';
import { TimeDuration } from './TimeDuration';

const meta: Meta<typeof TimeDuration> = {
  title: 'Components/TimeDuration',
  component: TimeDuration,
};

export default meta;

type Story = StoryObj<typeof TimeDuration>;

const now = new Date().toISOString();

export const Basic: Story = {
  args: {
    start: now,
    end: now,
  },
};
