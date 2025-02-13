import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { PurchaseFeedbackForm } from './PurchaseFeedbackForm';

export default {
  title: 'Components/PurchaseFeedbackForm',
  component: PurchaseFeedbackForm,
} as ComponentMeta<typeof PurchaseFeedbackForm>;

const Template: ComponentStory<typeof PurchaseFeedbackForm> = (args) => <PurchaseFeedbackForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'tittel',
  alternatives: ['samfundet.no', 'Venner', 'Plakat'],
  questions: ['hvem?', 'hva?', 'hvor?'],
};
