import type { Meta } from '@storybook/react';
import { EventEditButtons } from './EventEditButtons';

const meta: Meta<typeof EventEditButtons> = {
  title: 'Components/EventEditButtons',
  component: EventEditButtons,
  args: {
    title: 'EditButtons',
  },
};

export default meta;
