import { ComponentMeta, ComponentStory } from '@storybook/react';
import { EventQuery } from './EventQuery';

// Local component config.
export default {
  title: 'Components/EventQuery',
  component: EventQuery,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof EventQuery>;

const Template: ComponentStory<typeof EventQuery> = function (args) {
  return <EventQuery {...args}>Submit</EventQuery>;
};

export const Basic = Template.bind({});
Basic.args = {};
