import type { Meta, StoryObj } from '@storybook/react';
import { SpinningBorder } from './SpinningBorder';

// Local component config.
const meta: Meta<typeof SpinningBorder> = {
  title: 'Components/SpinningBorder',
  component: SpinningBorder,
};

export default meta;

type Story = StoryObj<typeof SpinningBorder>;

export const Basic: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea error nihil accusamus sunt deleniti soluta a quod nisi quasi rerum, ducimus doloribus, in aspernatur reiciendis quibusdam corporis laborum. Magnam, eligendi.',
  },
};

export const Circle: Story = {
  args: {
    radius: '100%',
    children:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea error nihil accusamus sunt deleniti soluta a quod nisi quasi rerum, ducimus doloribus, in aspernatur reiciendis quibusdam corporis laborum. Magnam, eligendi.',
  },
};

export const Purple: Story = {
  args: {
    colors: ['purple', 'cyan'],
    children:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea error nihil accusamus sunt deleniti soluta a quod nisi quasi rerum, ducimus doloribus, in aspernatur reiciendis quibusdam corporis laborum. Magnam, eligendi.',
  },
};
