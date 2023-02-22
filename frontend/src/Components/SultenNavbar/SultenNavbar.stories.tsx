import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { SultenNavbar } from './SultenNavbar';

const now = new Date();

export default {
  title: 'Components/SultenNavbar',
  component: SultenNavbar,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof SultenNavbar>;

const OneEvent: ComponentStory<typeof SultenNavbar> = function (args) {
  return (
    <BrowserRouter>
      <SultenNavbar />
    </BrowserRouter>
  );
};

export const Basic = OneEvent.bind({});
