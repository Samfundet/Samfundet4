import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { Footer } from './Footer';

// Local component config.
export default {
  title: 'Components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = () => <Footer />;

export const Basic = Template.bind({});
Basic.args = {};
