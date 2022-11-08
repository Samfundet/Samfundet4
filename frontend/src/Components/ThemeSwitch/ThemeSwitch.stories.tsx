import { ComponentMeta, ComponentStory } from '@storybook/react';
import { GlobalContextProvider } from '~/GlobalContextProvider';
import { ThemeSwitch } from './ThemeSwitch';

// Local component config.
export default {
  title: 'Components/ThemeSwitch',
  component: ThemeSwitch,
} as ComponentMeta<typeof ThemeSwitch>;

const Template: ComponentStory<typeof ThemeSwitch> = function (args) {
  return (
    <>
      <GlobalContextProvider>
        <ThemeSwitch {...args} />
      </GlobalContextProvider>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {};
