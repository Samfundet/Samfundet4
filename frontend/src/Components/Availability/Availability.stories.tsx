import { Availability } from './Availability';
import { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Availability',
  comonent: Availability,
};

const Template: ComponentStory<typeof Availability> = function (args) {
  return <Availability {...args}></Availability>;
};

export const Default = Template.bind({});
Default.args = {
  header: 'Not found',
  message: 'The resource you requested was not found',
};
