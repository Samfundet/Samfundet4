import type { Meta, StoryObj } from '@storybook/react';
import { MiniCalendar } from '~/Components';

const meta: Meta<typeof MiniCalendar> = {
  title: 'Components/MiniCalendar',
  component: MiniCalendar,
};

export default meta;

type Story = StoryObj<typeof MiniCalendar>;

export const Basic: Story = {
  args: {
    baseDate: new Date(2024, 3, 1),
    minDate: new Date(2024, 3, 3),
    maxDate: new Date(2024, 4, 10),
    markers: [{ date: new Date(2024, 3, 8) }, { date: new Date(2024, 3, 12) }],
    displayLabel: true,
  },
};
