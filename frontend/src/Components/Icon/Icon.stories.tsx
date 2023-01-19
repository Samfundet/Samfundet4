/* eslint-disable import/namespace */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Icon } from './Icon';
import { ICONS } from './IconConstants';
import { COLORS } from '~/types';

export default {
  title: 'Components/Icon',
  component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = function (args) {
  return <Icon {...args}></Icon>;
};

export const Regular = Template.bind({});
Regular.args = {
  className: 'regular',
  icon: ICONS.MENU,
  size: '20px',
  color: COLORS.red_samf,
};
