import type { Meta, StoryObj } from '@storybook/react';
import { SamfundetLogo } from '~/Components/SamfundetLogo';

// Local component config.
const meta: Meta<typeof SamfundetLogo> = {
  title: 'Components/SamfundetLogo',
  component: SamfundetLogo,
};

export default meta;

type Story = StoryObj<typeof SamfundetLogo>;

export const Basic: Story = {
  args: {},
};
