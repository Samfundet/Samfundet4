import type { Meta, StoryObj } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { SamfundetLogoSpinner } from './SamfundetLogoSpinner';

// Local component config.
const meta: Meta<typeof SamfundetLogoSpinner> = {
  title: 'Components/SamfundetLogoSpinner',
  component: SamfundetLogoSpinner,
  decorators: [
    (Story) => (
      <div style={{ margin: '50px' }}>
        <AuthContextProvider>
          <GlobalContextProvider>
            <Story />
          </GlobalContextProvider>
        </AuthContextProvider>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SamfundetLogoSpinner>;

export const Basic: Story = {
  render: () => <SamfundetLogoSpinner />,
};
