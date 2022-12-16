import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { InputField } from './InputField';

export default {
  title: 'Components/InputField',
  component: InputField,
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = function (args) {
  return <InputField {...args} />;
};

export const Basic = Template.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = { children: 'Label' };

export const WithComplexLabel = Template.bind({});
WithComplexLabel.args = { children: <span style={{ color: 'red' }}>Complex label</span> };

export const OnChange = Template.bind({});
OnChange.args = { onChange: action('OnChange') };
