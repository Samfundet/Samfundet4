import { ComponentMeta, ComponentStory } from '@storybook/react';
import { List } from './List';

// Local component config.
export default {
  title: 'Components/List',
  component: List,
  args: {},
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = function (args) {
  return <List {...args} />;
};

export const Unordered = Template.bind({});
Unordered.args = { items: [<div key={1}>{'First element'}</div>, <div key={2}>{'Second element'}</div>] };

export const Ordered = Template.bind({});
Ordered.args = {
  items: [<div key={1}>{'First element'}</div>, <div key={2}>{'Second element'}</div>],
  type: 'ordered',
};

export const NoBullets = Template.bind({});
NoBullets.args = {
  items: [<div key={1}>{'First element'}</div>, <div key={2}>{'Second element'}</div>],
  type: 'no_bullets',
};
