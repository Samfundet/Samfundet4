import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { EventCategoryValue } from '~/types';
import { EventQuery } from './EventQuery';

// Local component config.
const meta: Meta<typeof EventQuery> = {
  title: 'Components/EventQuery',
  component: EventQuery,
  argTypes: {
    venues: { control: 'object' },
    categories: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof EventQuery>;

export const Basic: Story = {
  args: {
    venues: ['Main Hall', 'Black Box', 'Open Air Stage'],
    // If EventCategoryValue is a string union, cast demo strings accordingly:
    categories: ['music', 'theatre', 'comedy'] as unknown as EventCategoryValue[],
  },
  render: (args) => {
    const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<EventCategoryValue | null>(null);

    return (
      <EventQuery
        venues={args.venues as string[]}
        categories={args.categories as EventCategoryValue[]}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    );
  },
};
