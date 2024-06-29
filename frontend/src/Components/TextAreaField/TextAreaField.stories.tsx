import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextAreaField } from './TextAreaField';

export default {
  title: 'Components/TextAreaField',
  component: TextAreaField,
} as ComponentMeta<typeof TextAreaField>;

const Template: ComponentStory<typeof TextAreaField> = (args) => <TextAreaField {...args} />;

export const Basic = Template.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = { children: 'Label' };

export const WithComplexLabel = Template.bind({});
WithComplexLabel.args = { children: <span style={{ color: 'red' }}>Complex label</span> };

export const OnChange = Template.bind({});
OnChange.args = { onChange: action('OnChange') };
