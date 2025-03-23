import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { EventDto } from '~/dto';
import { EventQuery } from './EventQuery';

// Local component config.
const meta: Meta<typeof EventQuery> = {
  title: 'Components/EventQuery',
  component: EventQuery,
};

export default meta;

type Story = StoryObj<typeof EventQuery>;

export const Basic: Story = {
  render: () => {
    const [events, setEvents] = useState<EventDto[]>([]);
    return <EventQuery allEvents={events} setEvents={setEvents} />;
  },
  args: {},
};
