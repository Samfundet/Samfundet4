import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Logo } from './Logo';

export default {
  title: 'Components/Logo',
  component: Logo,
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = function (args) {
  return <Logo {...args} />;
};

export const Samf = Template.bind({});
Samf.args = { color: 'org-color', size: 'medium', organization: 'Samfundet' };

export const Uka = Template.bind({});
Uka.args = { color: 'org-color', size: 'medium', organization: 'UKA' };

export const Isfit = Template.bind({});
Isfit.args = { color: 'org-color', size: 'medium', organization: 'ISFiT' };
