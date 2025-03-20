import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// Local component config.
export default {
  title: 'Components/Button',
  component: Button,
  args: {
    name: 'name',
  },
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: {},
  render: (args) => <Button {...args}>Submit</Button>,
};

export const Samf: Story = {
  args: { theme: 'samf' },
  render: (args) => <Button {...args}>Submit</Button>,
};

export const Secondary: Story = {
  args: { theme: 'secondary' },
  render: (args) => <Button {...args}>Submit</Button>,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Button {...args}>Submit</Button>,
};
