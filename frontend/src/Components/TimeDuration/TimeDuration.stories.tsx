import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TimeDuration } from './TimeDuration';

export default {
  title: 'Components/TimeDuration',
  component: TimeDuration,
} as ComponentMeta<typeof TimeDuration>;

const Template: ComponentStory<typeof TimeDuration> = function (args) {
  return <TimeDuration {...args} />;
};

const now = new Date().toISOString();

export const Basic = Template.bind({});
Basic.args = { start: now, end: now };
