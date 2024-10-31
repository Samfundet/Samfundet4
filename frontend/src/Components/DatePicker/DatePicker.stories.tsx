import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

// Local component config.
const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

const onChange = (value: unknown) => console.log('Selected:', value);

export const Basic: Story = {
  args: {
    onChange,
  },
};
