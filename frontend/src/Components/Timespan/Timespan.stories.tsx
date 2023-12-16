import { Timespan } from './Timespan';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Timespan',
  comonent: Timespan,
};

const Template: ComponentStory<typeof Timespan> = function (args) {
  return <Timespan {...args}></Timespan>;
};

export const Default = Template.bind({});
Default.args = {
};
