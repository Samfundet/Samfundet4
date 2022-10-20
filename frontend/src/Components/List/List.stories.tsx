import { ComponentMeta, ComponentStory } from '@storybook/react';
import { List } from './List';

// Local component config.
export default {
  title: 'Components/List',
  component: List,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = function (args) {
  return <List {...args} />;
};

export const Unordered = Template.bind({});
Unordered.args = { items: ['First element', 'Second element'] };

export const Ordered = Template.bind({});
Ordered.args = { items: ['First element', 'Second element'], type: 'ordered' };
