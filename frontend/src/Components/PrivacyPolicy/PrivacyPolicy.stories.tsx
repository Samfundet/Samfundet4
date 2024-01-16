import { ComponentMeta } from '@storybook/react';
import { PrivacyPolicy } from './PrivacyPolicy';

export default {
  title: 'Components/PrivacyPolicy',
  component: PrivacyPolicy,
} as ComponentMeta<typeof PrivacyPolicy>;

const Template = () => <PrivacyPolicy />;

export const Default = Template.bind({});
