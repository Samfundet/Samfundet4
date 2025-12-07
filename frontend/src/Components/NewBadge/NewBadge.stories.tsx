import type { Meta, StoryObj } from '@storybook/react';
import { NewBadge } from './NewBadge';
import { Icon } from '@iconify/react';

const meta: Meta<typeof NewBadge> = {
  title: 'Components/NewBadge',
  component: NewBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['red', 'purple', 'green', 'gold', 'gray', 'outline'],
      description: 'The visual theme/color variant of the badge',
    },
    children: {
      control: 'text',
      description: 'Content to display inside the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewBadge>;

export const Red: Story = {
  args: {
    theme: 'red',
    children: 'Error',
  },
};

export const Purple: Story = {
  args: {
    theme: 'purple',
    children: 'Featured',
  },
};

export const Green: Story = {
  args: {
    theme: 'green',
    children: 'Success',
  },
};

export const Gold: Story = {
  args: {
    theme: 'gold',
    children: 'Premium',
  },
};

export const Gray: Story = {
  args: {
    theme: 'gray',
    children: 'Inactive',
  },
};

export const Outline: Story = {
  args: {
    theme: 'outline',
    children: 'Default',
  },
};

export const WithIcon: Story = {
  args: {
    theme: 'red',
    children: (
      <>
        <Icon icon="humbleicons:exclamation" />
        Warning
      </>
    ),
  },
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <NewBadge theme="red">Red Badge</NewBadge>
      <NewBadge theme="purple">Purple Badge</NewBadge>
      <NewBadge theme="green">Green Badge</NewBadge>
      <NewBadge theme="gold">Gold Badge</NewBadge>
      <NewBadge theme="gray">Gray Badge</NewBadge>
      <NewBadge theme="outline">Outline Badge</NewBadge>
      <NewBadge theme="red">
        <Icon icon="humbleicons:exclamation"  />
        With Icon
      </NewBadge>
    </div>
  ),
};
