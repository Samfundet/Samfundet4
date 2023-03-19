import { AccessDenied } from './AccessDenied';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/AccessDenied',
  component: AccessDenied,
};

const Template: ComponentStory<typeof AccessDenied> = function () {
  return <AccessDenied></AccessDenied>;
};

export const Default = Template.bind({});
