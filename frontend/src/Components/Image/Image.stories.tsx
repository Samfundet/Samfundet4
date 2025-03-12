import type { Meta, StoryObj } from '@storybook/react';
import { logoBlack } from '~/assets';
import { Image } from './Image';

// Local component config.
const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  args: {
    src: logoBlack,
  },
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Basic: Story = {
  args: {},
};
