import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ToggleSwitch } from './ToggleSwitch';

// Local component config.
export default {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
} as ComponentMeta<typeof ToggleSwitch>;

const Template: ComponentStory<typeof ToggleSwitch> = function (args) {
  return <ToggleSwitch {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const WithIcons = Template.bind({});
WithIcons.args = { offIcon: '0', onIcon: '1' };
