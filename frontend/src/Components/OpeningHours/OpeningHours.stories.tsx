import type { Meta, StoryObj } from '@storybook/react';
import { OpeningHours } from './OpeningHours';

// Local component config.
const meta: Meta<typeof OpeningHours> = {
  title: 'Components/OpeningHours',
  component: OpeningHours,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    venues: [
      {
        id: 1,
        slug: 'daglighallen',
        name: 'Daglighallen',
        opening_monday: '08:00:00',
        closing_monday: '20:00:00',
        is_open_monday: true,
        opening_tuesday: '08:00:00',
        closing_tuesday: '20:00:00',
        is_open_tuesday: true,
        opening_wednesday: '08:00:00',
        closing_wednesday: '20:00:00',
        is_open_wednesday: true,
        opening_thursday: '08:00:00',
        closing_thursday: '20:00:00',
        is_open_thursday: true,
        opening_friday: '08:00:00',
        closing_friday: '20:00:00',
        is_open_friday: true,
        opening_saturday: '08:00:00',
        closing_saturday: '20:00:00',
        is_open_saturday: true,
        opening_sunday: '08:00:00',
        closing_sunday: '20:00:00',
        is_open_sunday: true,
      },
      {
        id: 2,
        slug: 'edgar',
        name: 'Edgar',
        opening_monday: '10:00:00',
        closing_monday: '22:00:00',
        is_open_monday: true,
        opening_tuesday: '10:00:00',
        closing_tuesday: '22:00:00',
        is_open_tuesday: true,
        opening_wednesday: '10:00:00',
        closing_wednesday: '22:00:00',
        is_open_wednesday: true,
        opening_thursday: '10:00:00',
        closing_thursday: '22:00:00',
        is_open_thursday: true,
        opening_friday: '10:00:00',
        closing_friday: '23:00:00',
        is_open_friday: true,
        opening_saturday: '10:00:00',
        closing_saturday: '23:00:00',
        is_open_saturday: true,
        opening_sunday: '00:00:00',
        closing_sunday: '00:00:00',
        is_open_sunday: false,
      },
    ],
  },
};

export const WithClosedDays: Story = {
  args: {
    venues: [
      {
        id: 1,
        slug: 'klubben',
        name: 'Klubben',
        opening_monday: '00:00:00',
        closing_monday: '00:00:00',
        is_open_monday: false,
        opening_tuesday: '00:00:00',
        closing_tuesday: '00:00:00',
        is_open_tuesday: false,
        opening_wednesday: '18:00:00',
        closing_wednesday: '02:00:00',
        is_open_wednesday: true,
        opening_thursday: '18:00:00',
        closing_thursday: '02:00:00',
        is_open_thursday: true,
        opening_friday: '18:00:00',
        closing_friday: '03:00:00',
        is_open_friday: true,
        opening_saturday: '18:00:00',
        closing_saturday: '03:00:00',
        is_open_saturday: true,
        opening_sunday: '00:00:00',
        closing_sunday: '00:00:00',
        is_open_sunday: false,
      },
    ],
  },
};
