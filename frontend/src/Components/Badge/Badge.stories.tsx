import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Badge } from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  args: {
    title: 'title',
  },
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args}>Badge</Badge>;

export const Basic = Template.bind({});
Basic.args = {};
