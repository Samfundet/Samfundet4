import { ComponentMeta, ComponentStory } from '@storybook/react';
import { kitteh } from '~/assets';
import { Infobox } from './Infobox';

export default {
  title: 'Components/InfoboxTEST',
  component: Infobox,
  args: {
    title: 'test title',
    img: kitteh,
    infoURL: 'https://www.samfundet.no/',
    infoTxt: 'Lorem ipsum dolor sit ametur adipiscing elit, sed do eiusmod tempor incididuntincididunt incididunt.',
    bgColor: 'red_samf',
  },
} as ComponentMeta<typeof Infobox>;
const Template: ComponentStory<typeof Infobox> = function (args) {
  return <Infobox {...args} />;
};
export const WithImgWithURL = Template.bind({});
WithImgWithURL.args = {
  type: 'WithImgWithURL',
};

export const NoImgWithURL = Template.bind({});
NoImgWithURL.args = {
  type: 'NoImgWithURL',
};

export const WithImgNoURL = Template.bind({});
WithImgNoURL.args = {
  type: 'WithImgNoURL',
};

export const NoImgNoURL = Template.bind({});
NoImgNoURL.args = {
  type: 'NoImgNoURL',
};
export const LongWithImg = Template.bind({});
LongWithImg.args = {
  type: 'LongWithImg',
};
export const LongWithOutImg = Template.bind({});
LongWithOutImg.args = {
  type: 'LongWithOutImg',
};
