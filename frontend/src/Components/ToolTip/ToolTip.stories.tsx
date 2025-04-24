import type { Meta, StoryObj } from '@storybook/react';
import { ToolTip } from './ToolTip';

const meta: Meta<typeof ToolTip> = {
  title: 'Components/ToolTip',
  component: ToolTip,
  decorators: [
    (Story) => (
      <div style={{ margin: '50px', padding: '20px', display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
  args: {},
};

export default meta;

type Story = StoryObj<typeof ToolTip>;

export const Basic: Story = {
  args: {
    value: 'You hovered!',
    alignment: 'top',
    children: 'Hover on me!',
  },
};
