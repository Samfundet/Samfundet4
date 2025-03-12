import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

// Local component config.
const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Basic: Story = {
  args: {
    color: 'red',
    icon: 'mdi-pen',
    title: 'Edit',
  },
  render: (args) => {
    function onClick() {
      alert('Hello!');
    }
    return <IconButton {...args} onClick={onClick} />;
  },
};
