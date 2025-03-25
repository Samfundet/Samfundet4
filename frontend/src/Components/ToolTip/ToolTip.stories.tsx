import type { Meta, StoryObj } from '@storybook/react';
import { ToolTip } from './ToolTip';

const meta: Meta<typeof ToolTip> = {
  title: 'Components/ToolTip',
  component: ToolTip,
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

export const Image: Story = {
  args: {
    display: 'image',
    alignment: 'top',
    value: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Kilroy_Was_Here_-_Washington_DC_WWII_Memorial.jpg',
    children: 'Hover on me!',
  },
};
