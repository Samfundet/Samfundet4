import type { Meta, StoryObj } from '@storybook/react';
import { InputFile } from './InputFile';

const meta: Meta<typeof InputFile> = {
  title: 'Components/InputFile',
  component: InputFile,
};

export default meta;

type Story = StoryObj<typeof InputFile>;

export const ImageSelect: Story = {
  args: {
    fileType: 'image',
  },
  render: (args) => (
    <form>
      <InputFile {...args} />
    </form>
  ),
};

export const PdfSelect: Story = {
  args: {
    fileType: 'pdf',
  },
  render: (args) => (
    <form>
      <InputFile {...args} />
    </form>
  ),
};
