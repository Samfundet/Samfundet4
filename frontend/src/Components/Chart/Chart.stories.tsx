import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LineChart } from '~/Components/Chart/LineChart';
import { BarChart } from '~/Components/Chart/BarChart';

const applicant_mock_data = [
  { label: '15. august', value: 36 },
  { label: '16. august', value: 90 },
  { label: '17. august', value: 25 },
  { label: '18. august', value: 10 },
  { label: '19. august', value: 15 },
  { label: '20. august', value: 22 },
  { label: '21. august', value: 5 },
  { label: '22. august', value: 7 },
  { label: '23. august', value: 42 },
  { label: '24. august', value: 30 },
  { label: '25. august', value: 32 },
  { label: '26. august', value: 70 },
  { label: '27. august', value: 20 },
  { label: '28. august', value: 3 },
];
// Metadata for LineChart
const lineChartMeta: ComponentMeta<typeof LineChart> = {
  title: 'Components/Chart/LineChart',
  component: LineChart,
  args: {
    data: applicant_mock_data,
    chartTitle: 'Søkere opptak',
    size: 'large',
    hAxisLegend: 'Dager',
    vAxisLegend: 'Søkere',
    hLabelCount: 5,
    spliceHLabel: [0, 7],
  },
};

// Metadata for BarChart
const barChartMeta: ComponentMeta<typeof BarChart> = {
  title: 'Components/Chart/BarChart',
  component: BarChart,
  args: {
    data: applicant_mock_data,
    chartTitle: 'Søkere opptak',
    size: 'large',
    hAxisLegend: 'Dager',
    vAxisLegend: 'Søkere',
    hLabelCount: 5,
    spliceHLabel: [0, 7],
  },
};

// Template for LineChart
const LineChartTemplate: ComponentStory<typeof LineChart> = (args) => <LineChart {...args} />;

// Template for BarChart
const BarChartTemplate: ComponentStory<typeof BarChart> = (args) => <BarChart {...args} />;

// Export metadata and stories for LineChart
export default lineChartMeta;
export const LineChartApplicantsPerDay = LineChartTemplate.bind({});
LineChartApplicantsPerDay.args = {};

// Export metadata and stories for BarChart
export const BarChartApplicantsPerDay = BarChartTemplate.bind({});
BarChartApplicantsPerDay.args = {};
