import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';

// Local component config.
const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
};

export default meta;

type Story = StoryObj<typeof List>;

export const Unordered: Story = {
  args: {
    items: [<div key={1}>{'First element'}</div>, <div key={2}>{'Second element'}</div>],
  },
};

export const Ordered: Story = {
  args: {
    items: [<div key={1}>{'First element'}</div>, <div key={2}>{'Second element'}</div>],
    type: 'ordered',
  },
};

export const NoBullets: Story = {
  args: {
    items: [<div key={1}>{'First element'}</div>, <div key={2}>{'Second element'}</div>],
    type: 'no_bullets',
  },
};
