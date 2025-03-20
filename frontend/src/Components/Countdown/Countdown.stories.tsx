import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '~/Components/Button';
import { Countdown } from './Countdown';

const meta: Meta<typeof Countdown> = {
  title: 'Components/Countdown',
  component: Countdown,
};

export default meta;

type Story = StoryObj<typeof Countdown>;

export const Basic: Story = {
  args: {
    targetDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
  },
  render: (args) => (
    <Countdown {...args}>
      <Button theme="green">he he he haw, Guilty</Button>
    </Countdown>
  ),
};

export const Short: Story = {
  args: {
    targetDate: new Date(new Date().getTime() + 60 * 1000 * 5),
  },
  render: (args) => (
    <Countdown {...args}>
      <Button theme="green">he he he haw, Guilty</Button>
    </Countdown>
  ),
};
