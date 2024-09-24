import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { type ReactElement, useState } from 'react';
import { type Tab, TabBar, type TabBarProps } from './TabBar';

export default {
  title: 'Components/TabBar',
  component: TabBar,
} as ComponentMeta<typeof TabBar>;

const Template: ComponentStory<typeof TabBar<void>> = (props: TabBarProps<void>) => {
  const [tab, setTab] = useState<Tab<void>>(props.tabs[0]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <TabBar {...props} selected={tab} onSetTab={setTab} />
    </div>
  );
};

export const Basic = Template.bind({}, {
  tabs: [
    { key: 1, label: 'Tab One' },
    { key: 2, label: 'Tab Two' },
    { key: 3, label: 'Tab Three' },
  ],
} as TabBarProps);

function customLabel(txt: string): ReactElement {
  return (
    <div style={{ display: 'flex', gap: '.25em' }}>
      <b style={{ color: '#5ac' }}>{txt}</b>
      <i style={{ opacity: '0.5' }}>Custom!</i>
    </div>
  );
}

export const CustomLabels = Template.bind({}, {
  tabs: [
    { key: 1, label: customLabel('Tab One') },
    { key: 2, label: customLabel('Tab Two') },
    { key: 3, label: customLabel('Tab Three') },
  ],
} as TabBarProps);

export const Vertical = Template.bind({}, {
  tabs: [
    { key: 1, label: 'Tab One' },
    { key: 2, label: 'Tab Two' },
    { key: 3, label: 'Tab Three' },
  ],
  vertical: true,
} as TabBarProps);

export const ManyTabs = Template.bind({}, {
  tabs: [
    { key: 1, label: 'Tab One' },
    { key: 2, label: 'Tab Two' },
    { key: 3, label: 'Tab Three' },
    { key: 4, label: 'Another tab with a long name' },
    { key: 5, label: 'Yet another right here' },
    { key: 6, label: "Hello, what's up?" },
    { key: 7, label: 'Tab Seven' },
  ],
} as TabBarProps);
