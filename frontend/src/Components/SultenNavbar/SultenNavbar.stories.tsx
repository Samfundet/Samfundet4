import type { Meta, StoryObj } from '@storybook/react';
import { SultenNavbar } from './SultenNavbar';

const meta: Meta<typeof SultenNavbar> = {
  title: 'Components/SultenNavbar',
  component: SultenNavbar,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SultenNavbar>;

export const Basic: Story = {
  args: {},
};
