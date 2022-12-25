import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { kitteh } from '~/assets';
import { EventSlip } from './EventSlip';

const now = new Date();

export default {
  title: 'Components/EventSlip',
  component: EventSlip,
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
} as ComponentMeta<typeof EventSlip>;

const OneEvent: ComponentStory<typeof EventSlip> = function (args) {
  return (
    <BrowserRouter>
      <EventSlip {...args} />
    </BrowserRouter>
  );
};

const ManyEvents: ComponentStory<typeof EventSlip> = function (args) {
  return (
    <BrowserRouter>
      {Array(8)
        .fill(1)
        .map((_, i) => (
          <EventSlip key={i} {...args} />
        ))}
    </BrowserRouter>
  );
};

export const Basic = OneEvent.bind({});

export const MultipleEvents = ManyEvents.bind({});
