import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { InputField } from './InputField';

export default {
  title: 'Components/InputField',
  component: InputField,
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = (args) => (
  <form>
    <fieldset>
      <InputField {...args} />
    </fieldset>
  </form>
);

export const Basic = Template.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = { children: 'Label' };

export const WithComplexLabel = Template.bind({});
WithComplexLabel.args = { children: <span style={{ color: 'red' }}>Complex label</span> };

export const OnChange = Template.bind({});
OnChange.args = { onChange: action('OnChange') };
