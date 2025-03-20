import type { Meta, StoryObj } from '@storybook/react';
import { kitteh } from '~/assets';
import { COLORS } from '~/types';
import { Infobox } from './Infobox';

const meta: Meta<typeof Infobox> = {
  title: 'Components/Infobox',
  component: Infobox,
  args: {
    title: 'test title',
    img: kitteh,
    infoURL: 'https://www.samfundet.no/',
    infoTxt: 'Lorem ipsum dolor sit ametur adipiscing elit, sed do eiusmod tempor incididuntincididunt incididunt.',
    bgColor: COLORS.red_samf,
  },
};

export default meta;

type Story = StoryObj<typeof Infobox>;

export const Basic: Story = {
  args: {},
};

export const Filled: Story = {
  args: {
    title: 'Filled Infobox',
    img: kitteh,
    infoURL: 'https://www.example.com',
    infoTxt: 'This is a filled infobox with custom content.',
    bgColor: COLORS.red_samf,
  },
};
