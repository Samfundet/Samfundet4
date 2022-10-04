import { ComponentMeta, ComponentStory, DecoratorFn } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Navbar } from './Navbar';

// Local component config.
export default {
  title: 'Components/Navbar',
  component: Navbar,
  decorators: [withRouter],
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = () => {
  return <Navbar />;
};

export const Primary = Template.bind({});
