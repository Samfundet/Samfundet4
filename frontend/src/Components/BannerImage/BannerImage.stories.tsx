import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BannerImage } from './BannerImage';

// Local component config.
export default {
  title: 'Components/BannerImage',
  component: BannerImage,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof BannerImage>;

const Template: ComponentStory<typeof BannerImage> = function (args) {
  return <BannerImage {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};
