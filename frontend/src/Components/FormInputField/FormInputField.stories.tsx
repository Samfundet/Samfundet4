import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FormInputField } from './FormInputField';

export default {
  title: 'Components/FormInputField',
  component: FormInputField,
  args: {
    required: false,
  },
} as ComponentMeta<typeof FormInputField>;

const Template: ComponentStory<typeof FormInputField> = function (args) {
  return <FormInputField {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};
