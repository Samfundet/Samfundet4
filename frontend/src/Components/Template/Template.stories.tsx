import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Template } from './Template';

// Local component config.
export default {
  title: 'Components/Template',
  component: Template,
} as ComponentMeta<typeof Template>;

const ExampleStory: ComponentStory<typeof Template> = function (args) {
  return <Template {...args} />;
};

export const Basic = ExampleStory.bind({});
Basic.args = {};
