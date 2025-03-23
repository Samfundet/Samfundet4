import type { Meta, StoryObj } from '@storybook/react';
import { Template } from './Template';

// Local component config.
const meta: Meta<typeof Template> = {
  title: 'Components/Template',
  component: Template,
};

export default meta;

type Story = StoryObj<typeof Template>;

export const Basic: Story = {
  args: {},
};
