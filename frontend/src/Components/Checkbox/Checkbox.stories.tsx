import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Checkbox } from './Checkbox';

// Local component config.
export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    name: 'name',
    label: 'Approve',
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = function (args) {
  return <Checkbox {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };
