import type { Meta, StoryObj } from '@storybook/react';
import { SultenButton } from './SultenButton';

// Local component config.
const meta: Meta<typeof SultenButton> = {
  title: 'Components/SultenButton',
  component: SultenButton,
  args: {
    name: 'name',
  },
};

export default meta;

type Story = StoryObj<typeof SultenButton>;

export const Basic: Story = {
  args: {
    children: 'Submit',
  },
};
