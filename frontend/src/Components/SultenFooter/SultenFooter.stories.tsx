import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SultenFooter } from './SultenFooter';

export default {
  title: 'Components/SultenFooter',
  component: SultenFooter,
  args: {},
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof SultenFooter>;

const OneEvent: ComponentStory<typeof SultenFooter> = function () {
  return <SultenFooter />;
};

export const Basic = OneEvent.bind({});
