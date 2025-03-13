import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

// Local component config.
const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    children: 'Samfundet',
  },
};

export const Underscore: Story = {
  args: {
    className: 'underscore',
    underline: true,
    url: 'https://samfundet.no/',
    children: 'Samfundet',
  },
};

export const Regular: Story = {
  args: {
    className: 'regular',
    underline: false,
    url: 'https://samfundet.no/',
    children: 'Samfundet',
  },
};
