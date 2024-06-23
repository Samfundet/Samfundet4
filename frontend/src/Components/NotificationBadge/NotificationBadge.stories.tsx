import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { NotificationBadge } from './NotificationBadge';

// Local component config.
export default {
  title: 'Components/NotificationBadge',
  component: NotificationBadge,
} as ComponentMeta<typeof NotificationBadge>;

const ExampleStory: ComponentStory<typeof NotificationBadge> = (args) => (
  <>
    <br />
    <NotificationBadge {...args} />
  </>
);

export const Basic = ExampleStory.bind({});
Basic.args = {};

export const WithBadge = ExampleStory.bind({});
WithBadge.args = { number: 5 };
