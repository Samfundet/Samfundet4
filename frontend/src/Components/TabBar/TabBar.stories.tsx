import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { type Tab, TabBar, type TabBarProps } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Components/TabBar',
  component: TabBar,
};

export default meta;

type Story = StoryObj<typeof TabBar>;

const Template = (props: TabBarProps<unknown>): ReactElement => {
  const [tab, setTab] = useState<Tab<unknown>>(props.tabs[0]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <TabBar {...props} selected={tab} onSetTab={setTab} />
    </div>
  );
};

export const Basic: Story = {
  render: Template,
  args: {
    tabs: [
      { key: 1, label: 'Tab One' },
      { key: 2, label: 'Tab Two' },
      { key: 3, label: 'Tab Three' },
    ],
  },
};

function customLabel(txt: string): ReactElement {
  return (
    <div style={{ display: 'flex', gap: '.25em' }}>
      <b style={{ color: '#5ac' }}>{txt}</b>
      <i style={{ opacity: '0.5' }}>Custom!</i>
    </div>
  );
}

export const CustomLabels: Story = {
  render: Template,
  args: {
    tabs: [
      { key: 1, label: customLabel('Tab One') },
      { key: 2, label: customLabel('Tab Two') },
      { key: 3, label: customLabel('Tab Three') },
    ],
  },
};

export const Vertical: Story = {
  render: Template,
  args: {
    tabs: [
      { key: 1, label: 'Tab One' },
      { key: 2, label: 'Tab Two' },
      { key: 3, label: 'Tab Three' },
    ],
    vertical: true,
  },
};

export const ManyTabs: Story = {
  render: Template,
  args: {
    tabs: [
      { key: 1, label: 'Tab One' },
      { key: 2, label: 'Tab Two' },
      { key: 3, label: 'Tab Three' },
      { key: 4, label: 'Another tab with a long name' },
      { key: 5, label: 'Yet another right here' },
      { key: 6, label: "Hello, what's up?" },
      { key: 7, label: 'Tab Seven' },
    ],
  },
};
