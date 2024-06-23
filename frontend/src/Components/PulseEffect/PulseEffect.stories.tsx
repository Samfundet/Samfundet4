import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { AuthContextProvider } from '~/context/AuthContext';
import { RadioButton } from '~/Components';
import { GlobalContextProvider } from '~/context/GlobalContextProvider';
import { PulseEffect } from './PulseEffect';

// Local component config.
export default {
  title: 'Components/PulseEffect',
  component: PulseEffect,
} as ComponentMeta<typeof PulseEffect>;

const Template: ComponentStory<typeof PulseEffect> = (args) => (
    <AuthContextProvider>
      <GlobalContextProvider>
        <PulseEffect {...args} />
      </GlobalContextProvider>
    </AuthContextProvider>
  );

export const ShortChild = Template.bind({});
ShortChild.args = {
  children: <span>Test</span>,
};

export const LongerChild = Template.bind({});
LongerChild.args = {
  children: <span>Some longer test example</span>,
};

export const WithRadioButton = Template.bind({});
WithRadioButton.args = {
  children: <RadioButton>Test</RadioButton>,
};
