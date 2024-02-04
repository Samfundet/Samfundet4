import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ToolTip } from './ToolTip';

export default {
  title: 'Components/ToolTip',
  component: ToolTip,
  args: {},
} as ComponentMeta<typeof ToolTip>;
const Template: ComponentStory<typeof ToolTip> = function (args) {
  return <ToolTip {...args}>Hover on me!</ToolTip>;
};

export const Basic = Template.bind({});
Basic.args = {
  value: 'You hovered!',
  alignment: 'top',
};

export const Image = Template.bind({});
Image.args = {
  display: 'image',
  alignment: 'top',
  value: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Kilroy_Was_Here_-_Washington_DC_WWII_Memorial.jpg',
};
