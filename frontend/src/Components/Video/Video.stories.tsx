import type { Meta, StoryObj } from '@storybook/react';
import { Video } from './Video';

// Local component config.
const meta: Meta<typeof Video> = {
  title: 'Components/Video',
  component: Video,
  args: {
    title: 'Approve',
  },
};

export default meta;

type Story = StoryObj<typeof Video>;

export const Basic: Story = {
  args: {
    embedId: '88kgbMcDIQ4',
  },
};
