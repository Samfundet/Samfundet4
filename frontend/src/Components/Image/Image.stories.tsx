import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { logoBlack } from '~/assets';
import { Image } from './Image';

// Local component config.
export default {
  title: 'Components/Image',
  component: Image,
  args: {
    src: logoBlack,
  },
} as ComponentMeta<typeof Image>;

const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
