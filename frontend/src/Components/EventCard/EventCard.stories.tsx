import type { Meta, StoryObj } from '@storybook/react';
import { kitteh } from '~/assets';
import { EventCard } from './EventCard';

const now = new Date();

const meta: Meta<typeof EventCard> = {
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
};

export default meta;

type Story = StoryObj<typeof EventCard>;

export const Basic: Story = {
  args: {},
};

export const MultipleEvents: Story = {
  render: (args) => (
    <>
      {Array(8)
        .fill(1)
        .map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
          <EventCard key={i} {...args} />
        ))}
    </>
  ),
};
