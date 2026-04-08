import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { VenueDto } from '~/dto';
import { VenueOpeningHoursBox } from './VenueOpeningHoursBox';

const meta: Meta<typeof VenueOpeningHoursBox> = {
  title: 'PagesAdmin/OpeningHoursAdminPage/VenueOpeningHoursBox',
  component: VenueOpeningHoursBox,
  args: {
    venue: {
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
      opening_sunday: '00:00:00',
      closing_sunday: '00:00:00',
      is_open_sunday: false,
    },
    onSave: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof VenueOpeningHoursBox>;

function Interactive(args: React.ComponentProps<typeof VenueOpeningHoursBox>) {
  const [{ venue }, updateArgs] = useArgs<{ venue: VenueDto }>();
  return (
    <VenueOpeningHoursBox
      {...args}
      venue={venue}
      onSave={(v, field, value) => updateArgs({ venue: { ...v, [field]: value } })}
    />
  );
}

export const Basic: Story = { render: Interactive };
