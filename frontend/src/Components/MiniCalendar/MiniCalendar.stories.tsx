import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MiniCalendar } from '~/Components';

export default {
  title: 'Components/MiniCalendar',
  component: MiniCalendar,
} as ComponentMeta<typeof MiniCalendar>;

const Template: ComponentStory<typeof MiniCalendar> = function (args) {
  return <MiniCalendar {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
  baseDate: new Date(2024, 3, 1),
  minDate: new Date(2024, 3, 3),
  maxDate: new Date(2024, 4, 10),
  markers: [{ date: new Date(2024, 3, 8) }, { date: new Date(2024, 3, 12) }],
  displayLabel: true,
};
