import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TabView, TabViewProps } from './TabView';

export default {
  title: 'Components/TabBar',
  component: TabView,
} as ComponentMeta<typeof TabView>;

const Template: ComponentStory<typeof TabView> = (props: TabViewProps) => {
  return <TabView tabs={props.tabs} />;
};

export const Basic = Template.bind({}, {
  tabs: [
    { key: 1, label: 'Tab One', value: <p>Tab One</p> },
    { key: 2, label: 'Tab Two', value: <p>Tab Two</p> },
    { key: 3, label: 'Tab Three', value: <p>Tab Three</p> },
  ],
} as TabViewProps);
