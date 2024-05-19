import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Chart } from './Chart';

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
