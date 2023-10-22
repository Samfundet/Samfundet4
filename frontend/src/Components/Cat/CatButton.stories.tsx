import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CatButton } from './CatButton';

// Local component config.
export default {
  title: 'Components/CatButton',
  component: CatButton,
  args: {
    name: 'name',
  },
} as ComponentMeta<typeof CatButton>;

const Template: ComponentStory<typeof CatButton> = function (args) {
  return <CatButton {...args}>Submit</CatButton>;
};

export const Basic = Template.bind({});
Basic.args = { disabled: true };
