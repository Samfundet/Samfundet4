import type { Meta, StoryObj } from '@storybook/react';
import { PurchaseFeedbackForm } from './PurchaseFeedbackForm';

const meta: Meta<typeof PurchaseFeedbackForm> = {
  title: 'Components/PurchaseFeedbackForm',
  component: PurchaseFeedbackForm,
};

export default meta;

type Story = StoryObj<typeof PurchaseFeedbackForm>;

export const Basic: Story = {
  args: {
    title: 'tittel',
    alternatives: ['samfundet.no', 'Venner', 'Plakat'],
    questions: ['hvem?', 'hva?', 'hvor?'],
  },
};
