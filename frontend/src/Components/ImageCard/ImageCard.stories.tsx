import type { Meta, StoryObj } from '@storybook/react';
import { ImageCard } from './ImageCard';

const meta: Meta<typeof ImageCard> = {
  title: 'Components/ImageCard',
  component: ImageCard,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ImageCard>;

export const Basic: Story = {
  args: {
    // You can add specific args for the Basic story here if needed
  },
};
