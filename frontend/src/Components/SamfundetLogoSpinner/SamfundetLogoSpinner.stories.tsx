import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { SamfundetLogoSpinner } from './SamfundetLogoSpinner';

// Local component config.
export default {
  title: 'Components/SamfundetLogoSpinner',
  component: SamfundetLogoSpinner,
} as ComponentMeta<typeof SamfundetLogoSpinner>;

const Template: ComponentStory<typeof SamfundetLogoSpinner> = () => (
    <div style={{ margin: '50px' }}>
      <AuthContextProvider>
        <GlobalContextProvider>
          <SamfundetLogoSpinner />
        </GlobalContextProvider>
      </AuthContextProvider>
    </div>
  );

export const Basic = Template.bind({});
