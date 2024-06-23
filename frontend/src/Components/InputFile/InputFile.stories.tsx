import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { InputFile } from './InputFile';

export default {
  title: 'Components/InputFile',
  component: InputFile,
} as ComponentMeta<typeof InputFile>;

const Template: ComponentStory<typeof InputFile> = (args) => (
    <form>
      <InputFile {...args} />
    </form>
  );

export const ImageSelect = Template.bind({});
ImageSelect.args = {
  fileType: 'image',
};

export const PdfSelect = Template.bind({});
PdfSelect.args = {
  fileType: 'pdf',
};
