import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PurchaseCallbackPage } from './PurchaseCallBackPage';

export default {
  title: 'Components/PurchaseCallbackPage',
  component: PurchaseCallbackPage,
} as ComponentMeta<typeof PurchaseCallbackPage>;

const Template: ComponentStory<typeof PurchaseCallbackPage> = function () {
  return <PurchaseCallbackPage></PurchaseCallbackPage>;
};
export const Basic = Template.bind({});
