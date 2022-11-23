import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Skeleton } from './Skeleton';

// Local component config.
export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  // Using defaults from:
  // https://www.npmjs.com/package/react-loading-skeleton
  args: {
    className: '',
    count: 1,
    baseColor: '',
    highlightColor: '',
    circle: false,
    borderRadius: '0.25rem',
    direction: 'ltr',
    duration: 1.5,
    enableAnimation: true,
    height: '',
    width: '100%',
    inline: false,
    style: {},
    containerClassName: '',
    containerTestId: '',
    wrapper: undefined,
  },
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = function (args) {
  return <Skeleton {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Multiple = Template.bind({});
Multiple.args = { count: 10 };

export const OtherColors = Template.bind({});
OtherColors.args = {
  baseColor: '#a03033',
  highlightColor: 'gold',
};

export const Circle = Template.bind({});
Circle.args = {
  circle: true,
  width: '200px',
  height: '200px',
};

export const Eyes = Template.bind({});
Eyes.args = {
  circle: true,
  width: '200px',
  height: '200px',
  direction: 'rtl',
  inline: true,
  duration: 2,
  baseColor: 'yellow',
  highlightColor: 'black',
  count: 2,
};
