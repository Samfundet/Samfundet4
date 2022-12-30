import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '~/AuthContext';
import { GlobalContextProvider } from '~/GlobalContextProvider';
import { Navbar } from './Navbar';

// Local component config.
export default {
  title: 'Components/Navbar',
  component: Navbar,
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = () => {
  return (
    <AuthContextProvider>
      <GlobalContextProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </GlobalContextProvider>
    </AuthContextProvider>
  );
};

export const Primary = Template.bind({});
