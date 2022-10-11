import { ComponentMeta, ComponentStory } from '@storybook/react';
import { InputField } from './InputField';

// Local component config.
export default {
  title: 'Components/InputField',
  component: InputField,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = function (args) {
  return <InputField {...args}>Option</InputField>;
};

export const Basic = Template.bind({});
Basic.args = {};
