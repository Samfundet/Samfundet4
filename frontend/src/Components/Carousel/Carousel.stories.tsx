import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

// Local component config.
const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
};

export default meta;

type Story = StoryObj<typeof Carousel>;

export const Basic: Story = {
  args: {
    header: 'Carousel (basic)',
  },
  render: (args) => (
    <Carousel {...args}>
      {[...Array(100)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
        <div key={i} style={{ width: '400px', height: '250px', background: '#aaa', borderRadius: '1em' }} />
      ))}
    </Carousel>
  ),
};

export const SmallItems: Story = {
  args: {
    header: 'Carousel (small items)',
  },
  render: (args) => (
    <Carousel {...args}>
      {[...Array(100)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
        <div key={i} style={{ width: '50px', height: '50px', background: '#aaa', borderRadius: '1em' }} />
      ))}
    </Carousel>
  ),
};
