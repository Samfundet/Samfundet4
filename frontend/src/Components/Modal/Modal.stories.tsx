import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';

// Local component config.
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    isOpen: true,
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  args: {
    isOpen: true, // Ensure isOpen is set here, as it's in the meta args
    children: 'Submit',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    children: 'Submit',
  },
};
