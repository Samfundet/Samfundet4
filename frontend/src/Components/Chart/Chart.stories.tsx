import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LineChart } from '~/Components/Chart/LineChart';

export default {
  title: 'Components/Chart',
  components: LineChart,
  args: {
    data: [
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
    ],
    chartTitle: 'Søkere opptak',
    size: 'large',
    hAxisLegend: 'Dager',
    vAxisLegend: 'Søkere',
    hLabelCount: 9,
    spliceVLabel: [0, 6],
  },
} as ComponentMeta<typeof LineChart>;

const Template: ComponentStory<typeof LineChart> = function (args) {
  return <LineChart {...args} />;
};

export const ApplicantsPerDay = Template.bind({});
ApplicantsPerDay.args = {};
