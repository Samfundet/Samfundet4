import type { Meta, StoryObj } from '@storybook/react';
import { SultenFooter } from './SultenFooter';

const meta: Meta<typeof SultenFooter> = {
  title: 'Components/SultenFooter',
  component: SultenFooter,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SultenFooter>;

export const Basic: Story = {
  args: {},
};
