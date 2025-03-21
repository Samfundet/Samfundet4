import type { Meta, StoryObj } from '@storybook/react';
import { front_lyche } from '~/assets';
import { SultenCard } from './SultenCard';

// Local component config.
const meta: Meta<typeof SultenCard> = {
  title: 'Components/SultenCard',
  component: SultenCard,
};

export default meta;

type Story = StoryObj<typeof SultenCard>;

export const Basic: Story = {
  args: {
    image: front_lyche,
    header: 'Sulten',
    text: 'Sulten er en god ting',
    buttonText: 'Trykk her',
    smallCard: false,
  },
};
