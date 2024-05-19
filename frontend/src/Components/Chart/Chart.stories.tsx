import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Chart, ChartData } from './Chart';
import { template } from '@babel/core';

export default {
  title: 'Components/Chart',
  components: Chart,
  args: {
    data: [
      { label: 'Gløshuagen', value: 50 },
      { label: 'Kalvskinnet', value: 30 },
      { label: 'DMM', value: 15 },
      { label: 'Dragvoll', value: 10 },
    ],
    chartTitle: 'Antall søkere per campus',
    chartType: 'pie',
  },
} as ComponentMeta<typeof Chart>;

const Template: ComponentStory<typeof Chart> = function (args) {
  return <Chart {...args} />;
};

export const PieChart = Template.bind({});
PieChart.args = {};

export const BarChart = Template.bind({});
const applicant_per_day: ChartData[] = [
  { label: '15. august', value: 3 },
  { label: '16. august', value: 5 },
  { label: '17. august', value: 7 },
  { label: '18. august', value: 6 },
  { label: '19. august', value: 8 },
  { label: '20. august', value: 10 },
  { label: '21. august', value: 4 },
  { label: '22. august', value: 9 },
  { label: '23. august', value: 15 },
  { label: '24. august', value: 12 },
  { label: '25. august', value: 11 },
  { label: '26. august', value: 14 },
  { label: '27. august', value: 3 },
  { label: '28. august', value: 5 },
];
BarChart.args = {
  chartType: 'bar',
  chartTitle: 'Søkere per dag - opptak H24',
  data: applicant_per_day,
  labelSpliceStart: 0,
  labelSpliceEnd: 3,
  vAxisLabel: 'Søkere',
  hAxisLabel: 'August',
};

export const LineChart = Template.bind({});
LineChart.args = { data: applicant_per_day, chartType: 'line' };
