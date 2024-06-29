import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { TimeDisplay } from './TimeDisplay';

export default {
  title: 'Components/TimeDisplay',
  component: TimeDisplay,
} as ComponentMeta<typeof TimeDisplay>;

const Template: ComponentStory<typeof TimeDisplay> = (args) => <TimeDisplay {...args} />;

const now = new Date().toISOString();

export const Basic = Template.bind({});
Basic.args = { timestamp: now, displayType: 'datetime' };

export const ShowDate = Template.bind({});
ShowDate.args = { timestamp: now, displayType: 'date' };

export const Time = Template.bind({});
Time.args = { timestamp: now, displayType: 'time' };

export const InvalidTime = Template.bind({});
InvalidTime.args = { timestamp: '' };

export const MissingTime = Template.bind({});
MissingTime.args = {};
