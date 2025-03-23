import type { Meta, StoryObj } from '@storybook/react';
import { NotificationBadge } from './NotificationBadge';

// Local component config.
const meta: Meta<typeof NotificationBadge> = {
  title: 'Components/NotificationBadge',
  component: NotificationBadge,
};

export default meta;

type Story = StoryObj<typeof NotificationBadge>;

export const Basic: Story = {
  args: {},
  render: (args) => (
    <>
      <br />
      <NotificationBadge {...args} />
    </>
  ),
};

export const WithBadge: Story = {
  args: { number: 5 },
  render: (args) => (
    <>
      <br />
      <NotificationBadge {...args} />
    </>
  ),
};
