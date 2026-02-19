import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { EventEditButtons } from './EventEditButtons';

const flexDecorator: Decorator = (Story) => (
  <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
    <Story />
  </div>
);

const meta: Meta<typeof EventEditButtons> = {
  title: 'Components/EventEditButtons',
  component: EventEditButtons,
  decorators: [flexDecorator],
};

export default meta;

type Story = StoryObj<typeof EventEditButtons>;

export const Default: Story = {
  args: {
    is_staff: true,
    id: '123',
    title: 'Test event',
  },
};
