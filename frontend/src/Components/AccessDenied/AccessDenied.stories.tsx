import type { ComponentStory } from '@storybook/react';
import { AccessDenied } from './AccessDenied';

export default {
  title: 'Components/AccessDenied',
  component: AccessDenied,
};

const Template: ComponentStory<typeof AccessDenied> = () => <AccessDenied />;

export const Default = Template.bind({});
