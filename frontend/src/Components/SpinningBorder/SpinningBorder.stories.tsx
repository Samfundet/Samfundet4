import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SpinningBorder } from './SpinningBorder';

// Local component config.
export default {
  title: 'Components/SpinningBorder',
  component: SpinningBorder,
  args: {},
} as ComponentMeta<typeof SpinningBorder>;

const Template: ComponentStory<typeof SpinningBorder> = function (args) {
  return (
    <>
      <SpinningBorder {...args}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea error nihil accusamus sunt deleniti soluta a quod
        nisi quasi rerum, ducimus doloribus, in aspernatur reiciendis quibusdam corporis laborum. Magnam, eligendi.
      </SpinningBorder>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Circle = Template.bind({});
Circle.args = {};
