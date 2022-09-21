import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Navbar } from './Navbar';

// Local component config.
export default {
  title: 'Components/Navbar',
  component: Navbar,
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = () => {
  return <Navbar />;
};

export const Primary = Template.bind({});
