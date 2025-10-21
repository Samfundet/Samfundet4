import type { Meta, StoryObj } from '@storybook/react';
import { EventEditButtons } from './EventEditButtons';

// Local component config.
const meta: Meta<typeof EventEditButtons> = {
  title: 'Components/Video',
  component: EventEditButtons,
  args: {
    title: 'Approve',
  },
};

export default meta;

type Story = StoryObj<typeof EventEditButtons>;

//export const Basic: Story = {
// args: {
//  embedId: '88kgbMcDIQ4',
//},
//};
