import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Image } from './Image';

// Local component config.
export default {
  title: 'Components/Image',
  component: Image,
  args: {
    src: 'https://www.visitbergen.com/imageresizer/?image=%2Fdbimgs%2FVerdensarvstedet-Bryggen-i-Bergen.jpg&action=Background_Overlay',
  },
} as ComponentMeta<typeof Image>;

const Template: ComponentStory<typeof Image> = function (args) {
  return <Image {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};
