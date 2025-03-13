import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Samf: Story = {
  args: { color: 'org-color', size: 'medium', organization: 'Samfundet' },
};

export const Uka: Story = {
  args: { color: 'org-color', size: 'medium', organization: 'UKA' },
};

export const Isfit: Story = {
  args: { color: 'org-color', size: 'medium', organization: 'ISFiT' },
};
