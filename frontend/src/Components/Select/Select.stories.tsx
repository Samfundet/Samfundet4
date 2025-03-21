import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

// Local component config.
const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: {
    name: 'name',
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  args: {
    options: [
      { value: 'alt1', label: 'alternativ 1' },
      { value: 'alt2', label: 'alternativ 2' },
    ],
  },
};

export const Many: Story = {
  args: {
    options: [
      { value: 'alt1', label: 'alternativ 1' },
      { value: 'alt2', label: 'alternativ 2' },
      { value: 'alt3', label: 'alternativ 3' },
      { value: 'alt4', label: 'alternativ 4' },
      { value: 'alt5', label: 'alternativ 5' },
      { value: 'alt6', label: 'alternativ 6' },
      { value: 'alt7', label: 'alternativ 7' },
      { value: 'alt8', label: 'alternativ 8' },
      { value: 'alt9', label: 'alternativ 9' },
      { value: 'alt10', label: 'alternativ 10' },
      { value: 'alt11', label: 'alternativ 11' },
      { value: 'alt12', label: 'alternativ 12' },
      { value: 'alt13', label: 'alternativ 13' },
      { value: 'alt14', label: 'alternativ 14' },
      { value: 'alt15', label: 'alternativ 15' },
      { value: 'alt16', label: 'alternativ 16' },
      { value: 'alt17', label: 'alternativ 17' },
      { value: 'alt18', label: 'alternativ 18' },
      { value: 'alt19', label: 'alternativ 19' },
      { value: 'alt20', label: 'alternativ 20' },
      { value: 'alt21', label: 'alternativ 21' },
      { value: 'alt22', label: 'alternativ 22' },
    ],
  },
};
