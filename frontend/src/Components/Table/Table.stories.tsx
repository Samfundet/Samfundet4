import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Table } from './Table';

// Local component config.
export default {
  title: 'Components/Table',
  component: Table,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = function (args) {
  return <Table {...args}></Table>;
};

export const Basic = Template.bind({});
Basic.args = {
  cols: [
    ['Title', 2],
    ['Name', 2],
    ['Count', 1],
  ],
};

