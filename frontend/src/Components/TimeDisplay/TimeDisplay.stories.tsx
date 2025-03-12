import type { Meta, StoryObj } from '@storybook/react';
import { TimeDisplay } from './TimeDisplay';

const meta: Meta<typeof TimeDisplay> = {
  title: 'Components/TimeDisplay',
  component: TimeDisplay,
};

export default meta;

type Story = StoryObj<typeof TimeDisplay>;

const now = new Date().toISOString();

export const Basic: Story = {
  args: {
    timestamp: now,
    displayType: 'datetime',
  },
};

export const ShowDate: Story = {
  args: {
    timestamp: now,
    displayType: 'date',
  },
};

export const Time: Story = {
  args: {
    timestamp: now,
    displayType: 'time',
  },
};

export const InvalidTime: Story = {
  args: {
    timestamp: '',
  },
};

export const MissingTime: Story = {
  args: {},
};
