import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Footer } from './Footer';

// Local component config.
export default {
  title: 'Components/Footer',
  component: Footer,
  args: {},
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = function (args) {
  return <Footer {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};
