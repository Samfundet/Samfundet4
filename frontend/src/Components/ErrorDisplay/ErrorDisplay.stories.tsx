import type { Meta, StoryObj } from '@storybook/react';
import { ErrorDisplay } from './ErrorDisplay';

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Components/Error',
  component: ErrorDisplay,
};

export default meta;

type Story = StoryObj<typeof ErrorDisplay>;

export const Default: Story = {
  args: {
    header: 'Not found',
    message: 'The resource you requested was not found',
  },
};
