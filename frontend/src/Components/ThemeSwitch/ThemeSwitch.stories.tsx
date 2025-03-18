import type { Meta, StoryObj } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { ThemeSwitch } from './ThemeSwitch';

// Local component config.
const meta: Meta<typeof ThemeSwitch> = {
  title: 'Components/ThemeSwitch',
  component: ThemeSwitch,
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

type Story = StoryObj<typeof ThemeSwitch>;

export const Basic: Story = {
  args: {},
};
