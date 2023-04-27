import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SultenNavbar } from './SultenNavbar';

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

const OneEvent: ComponentStory<typeof SultenNavbar> = function () {
  return <SultenNavbar />;
};

export const Basic = OneEvent.bind({});
