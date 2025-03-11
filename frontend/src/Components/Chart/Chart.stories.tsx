import type { Meta, StoryObj } from '@storybook/react';

import { Chart } from './Chart';

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
  { label: '29. august', value: 9 },
  { label: '15. august', value: 36 },
];

const campus_mock_data = [
  { label: 'Gløshuagen', value: 50 },
  { label: 'Kalvskinnet', value: 30 },
  { label: 'DMM', value: 15 },
  { label: 'Dragvoll', value: 10 },
];

const meta: Meta<typeof Chart> = {
  title: 'Components/Chart',
  component: Chart,
  args: {
    type: 'bar',
    data: applicant_mock_data,
    chartTitle: 'Søkere opptak',
    size: 'large',
    xAxisLegend: 'Dager',
    yAxisLegend: 'Søkere',
    yLabelCount: 9,
    xLabelMagnitude: 1,
    yLabelMagnitude: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Chart>;

export const ApplicantsPerDay: Story = {
  args: {},
};

export const CampusDistribution: Story = {
  args: {
    type: 'pie',
    data: campus_mock_data,
    chartTitle: 'Campus fordeling',
    size: 'large',
    legend: 'Antall søkere per campus',
  },
};
