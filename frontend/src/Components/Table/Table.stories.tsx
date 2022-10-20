import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Table, ITableCell, AlphabeticTableCell } from './Table';
import { Children } from 'types';

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
    [{ children: 'A' } as ITableCell, { children: 'B' } as ITableCell],
    [{ children: 'C' } as ITableCell, { children: 'D' } as ITableCell],
  ],
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  data: [
    [{ children: 'A' } as ITableCell, { children: 'B' } as ITableCell],
    [{ children: 'C' } as ITableCell, { children: 'D' } as ITableCell],
  ],
};

export const Sortable = Template.bind({});
Sortable.args = {
  columns: ['Sortable', 'Not sortable'],
  data: [
    [new AlphabeticTableCell('A'), { children: '-A' } as ITableCell],
    [new AlphabeticTableCell('Z'), { children: '-Z' } as ITableCell],
    [new AlphabeticTableCell('B'), { children: '-B' } as ITableCell],
  ],
};
