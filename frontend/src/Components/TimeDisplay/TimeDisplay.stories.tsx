import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TimeDisplay } from './TimeDisplay';

export default {
  title: 'Components/TimeDisplay',
  component: TimeDisplay,
} as ComponentMeta<typeof TimeDisplay>;

const Template: ComponentStory<typeof TimeDisplay> = function (args) {
  return <TimeDisplay {...args} />;
};

const now = new Date().toISOString();

export const Basic = Template.bind({});
Basic.args = { timestamp: now };

export const ShowTime = Template.bind({});
ShowTime.args = { timestamp: now, showTime: true };

export const InvalidTime = Template.bind({});
InvalidTime.args = { timestamp: '' };

export const MissingTime = Template.bind({});
MissingTime.args = {};
