import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { ThemeSwitch } from './ThemeSwitch';

// Local component config.
export default {
  title: 'Components/ThemeSwitch',
  component: ThemeSwitch,
} as ComponentMeta<typeof ThemeSwitch>;

const Template: ComponentStory<typeof ThemeSwitch> = function (args) {
  return (
    <>
      <AuthContextProvider>
        <GlobalContextProvider>
          <ThemeSwitch {...args} />
        </GlobalContextProvider>
      </AuthContextProvider>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {};
