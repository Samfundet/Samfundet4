import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Footer } from './Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = function (args) {
  return <Footer {...args}></Footer>;
};

export const Primary = Template.bind({});
Primary.args = {
  iconSize: 30,
};
