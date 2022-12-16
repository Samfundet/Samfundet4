import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { kitteh } from '~/assets';
import { EventCard } from './EventCard';

const now = new Date();

export default {
  title: 'Components/EventCard',
  component: EventCard,
  args: {
    event: {
      title: 'test title',
      venue: 'test venue',
      category: 'test category',
      startTime: now.toISOString(),
      img: kitteh,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof EventCard>;

const OneEvent: ComponentStory<typeof EventCard> = function (args) {
  return (
    <BrowserRouter>
      <EventCard {...args} />
    </BrowserRouter>
  );
};

const ManyEvents: ComponentStory<typeof EventCard> = function (args) {
  return (
    <BrowserRouter>
      {Array(8)
        .fill(1)
        .map((_, i) => (
          <EventCard key={i} {...args} />
        ))}
    </BrowserRouter>
  );
};

export const Basic = OneEvent.bind({});

export const MultipleEvents = ManyEvents.bind({});
