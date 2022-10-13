import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = function (args) {
  return <Input {...args} />;
};

export const Basic = Template.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = { children: 'Label' };

export const WithComplexLabel = Template.bind({});
WithComplexLabel.args = { children: <span style={{ color: 'red' }}>Complex label</span> };
