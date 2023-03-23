import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Dropdown } from './Dropdown';

// Local component config.
export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    name: 'name',
    label: 'Choose option',
  },
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = function (args) {
  return <Dropdown {...args}></Dropdown>;
};

export const Basic = Template.bind({});
Basic.args = {
  options: [
    { label: 'alternativ 1', value: 1 },
    { label: 'alternativ 2', value: 2 },
  ],
};
export const Many = Template.bind({});
Many.args = {
  options: Array(22).map((v) => {
    return { label: `alternative ${v}`, value: v };
  }),
};
