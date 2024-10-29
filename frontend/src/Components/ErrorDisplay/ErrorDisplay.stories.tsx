import type { ComponentStory } from '@storybook/react';
import { ErrorDisplay } from './ErrorDisplay';

export default {
  title: 'Components/Error',
  comonent: ErrorDisplay,
};

const Template: ComponentStory<typeof ErrorDisplay> = (args) => <ErrorDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {
  header: 'Not found',
  message: 'The resource you requested was not found',
};
