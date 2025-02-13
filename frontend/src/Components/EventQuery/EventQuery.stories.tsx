import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import type { EventDto } from '~/dto';
import { EventQuery } from './EventQuery';

// Local component config.
export default {
  title: 'Components/EventQuery',
  component: EventQuery,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof EventQuery>;

const Template: ComponentStory<typeof EventQuery> = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  return <EventQuery allEvents={events} setEvents={setEvents} />;
};

export const Basic = Template.bind({});
Basic.args = {};
