import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Image } from './Image';
import { logoBlack } from '~/assets';

// Local component config.
export default {
  title: 'Components/Image',
  component: Image,
  args: {
    src: logoBlack,
  },
} as ComponentMeta<typeof Image>;

const Template: ComponentStory<typeof Image> = function (args) {
  return <Image {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};
