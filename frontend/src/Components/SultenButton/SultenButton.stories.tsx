import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { SultenButton } from './SultenButton';

// Local component config.
export default {
  title: 'Components/SultenButton',
  component: SultenButton,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof SultenButton>;

const Template: ComponentStory<typeof SultenButton> = (args) => <SultenButton {...args}>Submit</SultenButton>;

export const Basic = Template.bind({});
Basic.args = {};
