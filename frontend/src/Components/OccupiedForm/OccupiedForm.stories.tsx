import { ComponentMeta, ComponentStory } from '@storybook/react';
import { OccupiedForm } from './OccupiedForm';

export default {
  title: 'Components/OccupiedForm',
  component: OccupiedForm,
} as ComponentMeta<typeof OccupiedForm>;

const Template: ComponentStory<typeof OccupiedForm> = function (args) {
  return <OccupiedForm {...args} />;
};

export const Basic = Template.bind({});
