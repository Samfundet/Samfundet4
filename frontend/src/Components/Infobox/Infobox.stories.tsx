import { ComponentMeta, ComponentStory } from '@storybook/react';
import { kitteh } from '~/assets';
import { Infobox } from './Infobox';

export default {
  title: 'Components/Infobox',
  component: Infobox,
  args: {
    titel: 'test title',
    img: kitteh,
    altTxt: 'test alt text',
    infoURL: 'https://www.samfundet.no/',
    infoTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    bgColor: 'red_samf',
  },
} as ComponentMeta<typeof Infobox>;
const Template: ComponentStory<typeof Infobox> = function (args) {
  return <Infobox {...args} />;
};
export const Basic = Template.bind({});
Basic.args = {};
