import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Table, ITableCell, ISortableTableCell } from './Table';

// Local component config.
export default {
  title: 'Components/Table',
  component: Table,
  args: {
    title: 'title',
  },
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = function (args) {
  return <Table {...args}></Table>;
};

export const Basic = Template.bind({});
Basic.args = {
  columns: ['Hello', 'Dude'],
  data: [
    [{ children: "A" } as ITableCell, { children: "B" } as ITableCell],
    [{ children: "C" } as ITableCell, { children: "D" } as ITableCell],
  ]
};


export const Sortable = Template.bind({});
Sortable.args = {
  columns: ['Sortable', 'Not sortable'],
  data: [
    [{ children: "A", compare: () => 0 } as ITableCell, { children: "B" } as ITableCell],
    [{ children: "C", compare: () => 1 } as ITableCell, { children: "D" } as ITableCell],
  ]
};
