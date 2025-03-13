import type { Meta, StoryObj } from '@storybook/react';
import { ExpandableHeader } from './ExpandableHeader';

// Local component config.
const meta: Meta<typeof ExpandableHeader> = {
  title: 'Components/ExpandableHeader',
  component: ExpandableHeader,
  args: {
    label: 'Choose option',
  },
};

export default meta;

type Story = StoryObj<typeof ExpandableHeader>;

export const Basic: Story = {
  args: {
    children: <div>Peek-a-Boo</div>,
  },
};

export const Nested: Story = {
  args: {
    children: <ExpandableHeader />,
  },
};

export const Multiple: Story = {
  render: (args) => (
    <>
      <ExpandableHeader {...args} />
      <ExpandableHeader {...args} />
    </>
  ),
  args: {
    children: <div>Peek-a-Boo</div>,
  },
};
