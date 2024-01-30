import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ManyToMany } from './ManyToMany';

export default {
  title: 'Components/ManyToMany',
  component: ManyToMany,
} as ComponentMeta<typeof ManyToMany>;

const Template: ComponentStory<typeof ManyToMany> = function () {
  return <ManyToMany />;
};

export const Basic = Template.bind({});
Basic.args = {};
