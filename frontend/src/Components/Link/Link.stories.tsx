import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Link } from './Link';

// Local component config.
export default {
  title: 'Components/Link',
  component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Samfundet',
};

export const Underscore = Template.bind({});
Underscore.args = {
  className: 'underscore',
  underline: true,
  url: 'https://samfundet.no/',
  children: 'Samfundet',
};

export const Regular = Template.bind({});
Regular.args = {
  className: 'regular',
  underline: false,
  url: 'https://samfundet.no/',
  children: 'Samfundet',
};
