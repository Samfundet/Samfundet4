import type { Meta, StoryObj } from '@storybook/react';
import { ToolTip } from './ToolTip';

const meta: Meta<typeof ToolTip> = {
  title: 'Components/ToolTip',
  component: ToolTip,
  decorators: [
    (Story) => (
      <div style={{ margin: '100px', padding: '50px', display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    showArrow: { control: 'boolean' },
    alignment: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToolTip>;

export const Basic: Story = {
  args: {
    value: 'You hovered!',
    alignment: 'top',
    children: 'Hover on me!',
    followCursor: false,
    showArrow: true,
  },
};
