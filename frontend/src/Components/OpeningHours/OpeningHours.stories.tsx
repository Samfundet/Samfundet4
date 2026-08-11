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
        id: 1,
        slug: 'daglighallen',
        name: 'Daglighallen',
        opening_monday: '08:00:00',
        closing_monday: '20:00:00',
        opening_tuesday: '08:00:00',
        closing_tuesday: '20:00:00',
        opening_wednesday: '08:00:00',
        closing_wednesday: '20:00:00',
        opening_thursday: '08:00:00',
        closing_thursday: '20:00:00',
        opening_friday: '08:00:00',
        closing_friday: '20:00:00',
        opening_saturday: '08:00:00',
        closing_saturday: '20:00:00',
        opening_sunday: '08:00:00',
        closing_sunday: '20:00:00',
      },
      {
        id: 2,
        slug: 'edgar',
        name: 'Edgar',
        opening_monday: '08:00:00',
        closing_monday: '20:00:00',
        opening_tuesday: '08:00:00',
        closing_tuesday: '20:00:00',
        opening_wednesday: '08:00:00',
        closing_wednesday: '20:00:00',
        opening_thursday: '08:00:00',
        closing_thursday: '20:00:00',
        opening_friday: '08:00:00',
        closing_friday: '20:00:00',
        opening_saturday: '08:00:00',
        closing_saturday: '20:00:00',
        opening_sunday: '08:00:00',
        closing_sunday: '20:00:00',
      },
      {
        id: 3,
        slug: 'klubben',
        name: 'Klubben',
        opening_monday: '08:00:00',
        closing_monday: '20:00:00',
        opening_tuesday: '08:00:00',
        closing_tuesday: '20:00:00',
        opening_wednesday: '08:00:00',
        closing_wednesday: '20:00:00',
        opening_thursday: '08:00:00',
        closing_thursday: '20:00:00',
        opening_friday: '08:00:00',
        closing_friday: '20:00:00',
        opening_saturday: '08:00:00',
        closing_saturday: '20:00:00',
        opening_sunday: '08:00:00',
        closing_sunday: '20:00:00',
      },
      {
        id: 4,
        slug: 'storsalen',
        name: 'Storsalen',
        opening_monday: '08:00:00',
        closing_monday: '20:00:00',
        opening_tuesday: '08:00:00',
        closing_tuesday: '20:00:00',
        opening_wednesday: '08:00:00',
        closing_wednesday: '20:00:00',
        opening_thursday: '08:00:00',
        closing_thursday: '20:00:00',
        opening_friday: '08:00:00',
        closing_friday: '20:00:00',
        opening_saturday: '08:00:00',
        closing_saturday: '20:00:00',
        opening_sunday: '08:00:00',
        closing_sunday: '20:00:00',
      },
    ],
  },
};
