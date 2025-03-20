import type { Meta, StoryObj } from '@storybook/react';
import { InputTime } from './InputTime';

const meta: Meta<typeof InputTime> = {
  title: 'Components/InputTime',
  component: InputTime,
};

export default meta;

type Story = StoryObj<typeof InputTime>;

export const Basic: Story = {
  args: {},
};
