import type { Meta, StoryObj } from '@storybook/react';
import { BackButton } from './BackButton';

// Local component config.
const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
};

export default meta;

type Story = StoryObj<typeof BackButton>;

export const BackButtonTemplate: Story = {
  render: (args) => <BackButton {...args} />,
};
