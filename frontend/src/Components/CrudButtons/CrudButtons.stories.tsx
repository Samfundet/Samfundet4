import type { Meta, StoryObj } from '@storybook/react';
import { CrudButtons } from './CrudButtons';

// Local component config.
const meta: Meta<typeof CrudButtons> = {
  title: 'Components/CrudButtons',
  component: CrudButtons,
};

export default meta;

type Story = StoryObj<typeof CrudButtons>;

export const Basic: Story = {
  render: (args) => {
    function onClick() {
      alert('Hello!');
    }
    return <CrudButtons {...args} onEdit={onClick} onDelete={onClick} />;
  },
};
