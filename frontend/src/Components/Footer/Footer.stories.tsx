import { Footer } from './Footer';
import { ComponentMeta, ComponentStory } from '@storybook/react';

//Take a look at this for using pictures:
//https://storybook.js.org/docs/react/configure/images-and-assets

// Local component config.
export default {
  title: 'Components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;


const Template: ComponentStory<typeof Footer> = function (args) {
  return <Footer {...args}></Footer>;
};

export const Primary = Template.bind({});
Primary.args = {
  iconSize: 25
}
