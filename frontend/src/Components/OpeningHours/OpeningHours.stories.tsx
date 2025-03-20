import type { Meta, StoryObj } from '@storybook/react';
import { OpeningHours } from './OpeningHours';

// Local component config.
const meta: Meta<typeof OpeningHours> = {
  title: 'Components/OpeningHours',
  component: OpeningHours,
};

export default meta;

type Story = StoryObj<typeof OpeningHours>;

export const Basic: Story = {
  args: {
    venues: [
      {
        name: 'Daglighallen',
        url: 'www.google.com',
        start: '2011-10-05T14:00:00.000Z',
        end: '2011-10-05T17:00:00.000Z',
      },
      { name: 'Edgar', url: 'www.google.com', start: '2011-10-05T12:00:00.000Z', end: '2011-10-05T17:00:00.000Z' },
      { name: 'Klubben', url: 'www.google.com', start: '2011-10-05T16:00:00.000Z', end: '2011-10-05T18:00:00.000Z' },
      { name: 'Storsalen', url: 'www.google.com', start: '2011-10-05T14:00:00.000Z', end: '2011-10-05T22:00:00.000Z' },
    ],
  },
};
