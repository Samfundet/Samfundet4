import type { Meta, StoryObj } from '@storybook/react';
import { ToggleSwitch } from './ToggleSwitch';

// Local component config.
const meta: Meta<typeof ToggleSwitch> = {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
};

export default meta;

type Story = StoryObj<typeof ToggleSwitch>;

export const Basic: Story = {
  args: {},
};

export const Disabled: Story = {
  args: { disabled: true },
};
