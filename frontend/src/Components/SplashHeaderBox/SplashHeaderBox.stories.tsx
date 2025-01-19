import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { SplashHeaderBox } from './SplashHeaderBox';

// Local component config.
export default {
  title: 'Components/SplashHeaderBox',
  component: SplashHeaderBox,
} as ComponentMeta<typeof SplashHeaderBox>;

const Template: ComponentStory<typeof SplashHeaderBox> = (args) => (
  <>
    <AuthContextProvider>
      <GlobalContextProvider>
        <SplashHeaderBox {...args} />
      </GlobalContextProvider>
    </AuthContextProvider>
  </>
);

export const Basic = Template.bind({});
Basic.args = {};
