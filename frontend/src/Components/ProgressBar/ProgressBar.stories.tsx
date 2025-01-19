import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

// Local component config.
export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = (args) => <ProgressBar {...args} />;

export const Low = Template.bind({});
Low.args = {
  value: 25,
  max: 100,
};

export const Medium = Template.bind({});
Medium.args = {
  value: 50,
  max: 100,
};

export const High = Template.bind({});
High.args = {
  value: 75,
  max: 100,
};

export const Loading = Template.bind({});
Loading.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = { children: <div>Label</div> };

export const FullWidth = Template.bind({});
FullWidth.args = { fullWidth: true };
