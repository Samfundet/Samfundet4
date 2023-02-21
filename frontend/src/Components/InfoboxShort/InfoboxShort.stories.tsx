import { ComponentMeta, ComponentStory } from '@storybook/react';
import { kitteh } from '~/assets';
import { InfoboxShort } from './InfoboxShort';

export default {
  title: 'Components/InfoboxShort',
  component: InfoboxShort,
  args: {
    titel: 'test title',
    img: kitteh,
    infoURL: 'https://www.samfundet.no/',
    infoTxt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    bgColor: 'red_samf',
    withImg: true,
    withURL: true,
  },
} as ComponentMeta<typeof InfoboxShort>;
const Template: ComponentStory<typeof InfoboxShort> = function (args) {
  return <InfoboxShort {...args} />;
};
export const Basic = Template.bind({});
Basic.args = {};
