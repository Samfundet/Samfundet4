import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { kitteh } from '~/assets';
import { COLORS } from '~/types';
import { Infobox } from './Infobox';

export default {
  title: 'Components/Infobox',
  component: Infobox,
  args: {
    title: 'test title',
    img: kitteh,
    infoURL: 'https://www.samfundet.no/',
    infoTxt: 'Lorem ipsum dolor sit ametur adipiscing elit, sed do eiusmod tempor incididuntincididunt incididunt.',
    bgColor: COLORS.red_samf,
  },
} as ComponentMeta<typeof Infobox>;
const Template: ComponentStory<typeof Infobox> = (args) => <Infobox {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
