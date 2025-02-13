import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { ToggleSwitch } from './ToggleSwitch';

// Local component config.
export default {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
} as ComponentMeta<typeof ToggleSwitch>;

const Template: ComponentStory<typeof ToggleSwitch> = (args) => <ToggleSwitch {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };
