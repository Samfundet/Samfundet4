import { ComponentMeta, ComponentStory } from '@storybook/react';
import { EventCard } from './EventCard';
import { kitteh } from '~/assets';

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
  return <EventCard {...args} />;
};

const ManyEvents: ComponentStory<typeof EventCard> = function (args) {
  return (
    <>
      {Array(8)
        .fill(1)
        .map((_, i) => (
          <EventCard key={i} {...args} />
        ))}
    </>
  );
};

export const Basic = OneEvent.bind({});

export const MultipleEvents = ManyEvents.bind({});
