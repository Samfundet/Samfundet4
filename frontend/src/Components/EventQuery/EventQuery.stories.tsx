import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { EventDto } from '~/dto';
import { EventQuery } from './EventQuery';

// Local component config.
export default {
  title: 'Components/EventQuery',
  component: EventQuery,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof EventQuery>;

const Template: ComponentStory<typeof EventQuery> = function () {
  const [events, setEvents] = useState<EventDto[]>([]);
  return <EventQuery allEvents={events} setEvents={setEvents} />;
};

export const Basic = Template.bind({});
Basic.args = {};
