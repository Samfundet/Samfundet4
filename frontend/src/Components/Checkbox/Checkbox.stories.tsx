import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Checkbox } from './Checkbox';

// Local component config.
export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = function (args) {
  return <Checkbox {...args}>Submit</Checkbox>;
};

export const Basic = Template.bind({});
Basic.args = {};
