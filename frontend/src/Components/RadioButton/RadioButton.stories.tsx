import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';

// Local component config.
const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
  args: {
    name: 'name',
  },
};

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Basic: Story = {
  args: {
    children: 'Option',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Option',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    children: 'Option',
  },
};
