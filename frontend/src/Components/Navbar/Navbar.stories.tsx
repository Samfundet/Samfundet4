import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalContextProvider } from '~/GlobalContextProvider';
import { Navbar } from './Navbar';

// Local component config.
export default {
  title: 'Components/Navbar',
  component: Navbar,
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = () => {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </GlobalContextProvider>
  );
};

export const Primary = Template.bind({});
