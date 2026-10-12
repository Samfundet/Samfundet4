import type { Meta, StoryObj } from '@storybook/react';
import { CrudButtons } from './CrudButtons';

const toggle = {
  control: 'inline-radio',
  options: ['show', 'hide'],
  mapping: { show: 'show', hide: null },
} as const;

const meta: Meta<typeof CrudButtons> = {
  title: 'Components/CrudButtons',
  component: CrudButtons,
  argTypes: {
    onView: toggle,
    onCopy: toggle,
    onDelete: toggle,
    onEdit: toggle,
    onManage: toggle,
  },
  args: {
    onView: 'show',
    onManage: 'show',
    onCopy: 'show',
    onDelete: 'show',
    onEdit: 'show',
  },
};

export default meta;

type Story = StoryObj<typeof CrudButtons>;

export const Default: Story = {
  render: (args) => {
    return <CrudButtons {...args} />;
  },
};
