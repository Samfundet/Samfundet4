import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { InputTime } from './InputTime';

export default {
  title: 'Components/InputTime',
  component: InputTime,
} as ComponentMeta<typeof InputTime>;

const Template: ComponentStory<typeof InputTime> = (args) => <InputTime {...args}>Option</InputTime>;

export const Basic = Template.bind({});
Basic.args = {};
