import type { ComponentMeta, ComponentStory } from '@storybook/react';
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

const OneEvent: ComponentStory<typeof EventCard> = (args) => <EventCard {...args} />;

const ManyEvents: ComponentStory<typeof EventCard> = (args) => (
  <>
    {Array(8)
      .fill(1)
      .map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
        <EventCard key={i} {...args} />
      ))}
  </>
);

export const Basic = OneEvent.bind({});

export const MultipleEvents = ManyEvents.bind({});
