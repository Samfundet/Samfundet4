import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from './Button';

// Local component config.
export default {
  title: 'Components/Button',
  component: Button,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = function (args) {
  return <Button {...args}>Submit</Button>;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Samf = Template.bind({});
Samf.args = { theme: 'samf' };

export const Secondary = Template.bind({});
Secondary.args = { theme: 'secondary' };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };
