import type { Meta, StoryObj } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { SplashHeaderBox } from './SplashHeaderBox';

// Local component config.
const meta: Meta<typeof SplashHeaderBox> = {
  title: 'Components/SplashHeaderBox',
  component: SplashHeaderBox,
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

type Story = StoryObj<typeof SplashHeaderBox>;

export const Basic: Story = {
  args: {},
};
