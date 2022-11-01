import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DropDown } from './DropDown';

// Local component config.
export default {
  title: 'Components/DropDown',
  component: DropDown,
  args: {
    name: 'name',
    label: 'Choose option',
  },
} as ComponentMeta<typeof DropDown>;

const Template: ComponentStory<typeof DropDown> = function (args) {
  return <DropDown {...args}></DropDown>;
};

export const Basic = Template.bind({});
Basic.args = { dropDownList: ['alternativ 1', 'alternativ 2'] };
