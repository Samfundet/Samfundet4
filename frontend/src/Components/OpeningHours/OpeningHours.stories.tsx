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
        opening: '2011-10-05T14:00:00.000Z',
        closing: '2011-10-05T17:00:00.000Z',
      },
      { name: 'Edgar', opening: '2011-10-05T12:00:00.000Z', closing: '2011-10-05T17:00:00.000Z' },
      { name: 'Klubben', opening: '2011-10-05T16:00:00.000Z', closing: '2011-10-05T18:00:00.000Z' },
      { name: 'Storsalen', opening: '2011-10-05T14:00:00.000Z', closing: '2011-10-05T22:00:00.000Z' },
    ],
  },
};
