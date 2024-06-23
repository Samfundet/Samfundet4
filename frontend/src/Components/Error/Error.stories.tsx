import { Error } from './Error';
import type { ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Error',
  comonent: Error,
};

const Template: ComponentStory<typeof Error> = (args) => <Error {...args}></Error>;

export const Default = Template.bind({});
Default.args = {
  header: 'Not found',
  message: 'The resource you requested was not found',
};
