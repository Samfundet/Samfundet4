import { Icon } from '@iconify/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Table } from './Table';

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
  data: [{ cells: ['a', 'b'] }, { cells: ['c', 'd'] }, { cells: ['e', 'f'] }],
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  data: [{ cells: ['a', 'b'] }, { cells: ['c', 'd'] }, { cells: ['e', 'f'] }],
};

export const Sortable = Template.bind({});
Sortable.args = {
  columns: [{ content: 'Sortable', sortable: true }, 'Not sortable', 'Random col'],
  data: [{ cells: ['a', 'b'] }, { cells: ['c', 'd'] }, { cells: ['e', 'f'] }],
};

export const MultipleSortableRows = Template.bind({});
MultipleSortableRows.args = {
  columns: [{ content: 'Sortable', sortable: true }, { content: 'Also sortable', sortable: true }, 'Random col'],
  data: [{ cells: ['a', 'b'] }, { cells: ['c', 'd'] }, { cells: ['e', 'f'] }],
};

export const DateSortable = Template.bind({});
DateSortable.args = {
  columns: [{ content: 'Sortable Date', sortable: true }, 'Random col'],
  data: [
    { cells: [new Date(2023, 0, 1), 'January 1st'] },
    { cells: [new Date(2023, 0, 3), 'January 3rd'] },
    { cells: [new Date(2023, 2, 1), 'March 1st'] },
    { cells: [new Date(2023, 4, 2), 'May 2nd'] },
  ],
};

export const CustomSortableThings = Template.bind({});
CustomSortableThings.args = {
  columns: [{ content: 'Sortable Thing', sortable: true }, 'Comment'],
  data: [
    { cells: [{ content: <Icon icon="mdi:close" />, value: 0 }, 'Very nice'] },
    { cells: [{ content: <Icon icon="mdi:pencil" />, value: 1 }, 'Okay'] },
    { cells: [{ content: <Icon icon="mdi:square" />, value: 2 }, 'Weird'] },
    { cells: [{ content: <Icon icon="mdi:circle" />, value: 3 }, 'Rude'] },
  ],
};
