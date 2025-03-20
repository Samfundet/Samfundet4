import type { Meta, StoryObj } from '@storybook/react';
import { TabView } from './TabView';

const meta: Meta<typeof TabView> = {
  title: 'Components/TabView',
  component: TabView,
};

export default meta;

type Story = StoryObj<typeof TabView>;

export const Basic: Story = {
  args: {
    tabs: [
      { key: 1, label: 'Tab One', value: <p>Tab One</p> },
      { key: 2, label: 'Tab Two', value: <p>Tab Two</p> },
      { key: 3, label: 'Tab Three', value: <p>Tab Three</p> },
    ],
  },
};
