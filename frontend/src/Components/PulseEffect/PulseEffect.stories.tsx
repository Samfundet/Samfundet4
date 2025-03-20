import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from '~/Components';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { PulseEffect } from './PulseEffect';

// Local component config.
const meta: Meta<typeof PulseEffect> = {
  title: 'Components/PulseEffect',
  component: PulseEffect,
  decorators: [
    (Story) => (
      <AuthContextProvider>
        <GlobalContextProvider>
          <Story />
        </GlobalContextProvider>
      </AuthContextProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PulseEffect>;

export const ShortChild: Story = {
  args: {
    children: <span>Test</span>,
  },
};

export const LongerChild: Story = {
  args: {
    children: <span>Some longer test example</span>,
  },
};

export const WithRadioButton: Story = {
  args: {
    children: <RadioButton>Test</RadioButton>,
  },
};
