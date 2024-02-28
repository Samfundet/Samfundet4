import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PurchaseFeedbackForm } from './PurchaseFeedbackForm';

export default {
  title: 'Components/PurchaseFeedbackForm',
  component: PurchaseFeedbackForm,
} as ComponentMeta<typeof PurchaseFeedbackForm>;

const Template: ComponentStory<typeof PurchaseFeedbackForm> = (args) => <PurchaseFeedbackForm {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  alternatives: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'], // Provide alternatives here
};
