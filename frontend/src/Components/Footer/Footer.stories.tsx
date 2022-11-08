import { Footer } from './Footer';
import { ComponentMeta, ComponentStory } from '@storybook/react';

// Local component config.
export default {
  title: 'Components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = function (args) {
  return <Footer></Footer>;
};

export const Primary = Template.bind({});
