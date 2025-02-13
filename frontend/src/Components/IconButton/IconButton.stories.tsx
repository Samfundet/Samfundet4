import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { IconButton } from './IconButton';

// Local component config.
export default {
  title: 'Components/IconButton',
  component: IconButton,
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => {
  function onClick() {
    alert('Hello!');
  }
  return <IconButton {...args} onClick={onClick} />;
};

export const Basic = Template.bind({});
Basic.args = {
  color: 'red',
  icon: 'mdi-pen',
  title: 'Edit',
};
